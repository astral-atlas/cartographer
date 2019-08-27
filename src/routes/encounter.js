// @flow
/*::
import type { EncounterService } from '../services/atlas/encounter';
import type { EventLogger } from '../services/log.2';
*/
const { toObject, toString } = require('@lukekaalim/to');
const { createRESTRoute } = require('../lib/route.2');
const { ok, internalServerError, notFound, badInput } = require('../lib/response');
const { toEncounterID } = require('../models/encounter');
const { toCreatureId } = require('../models/creature');
const { toUserID } = require('../models/user');
const { readStream } = require('../lib/stream');

const toEncounterPostBody = toObject({
  title: toString,
});

const toDeclareActionPostBody = toObject({
  description: toString,
  creatureId: toString,
});

const createEncounterRoutes = (logger/*: EventLogger*/, encounters/*: EncounterService*/) => {
  const createLoggedRESTRoute = createRESTRoute(logger);

  const getEncounter = createLoggedRESTRoute('/encounters', async (queries) => {
    const [, encounterIdQuery] = queries.find(([name]) => name === 'encounterId') || [, null];
    if (encounterIdQuery === null) {
      return badInput('Missing ?encounterID query');
    }
    const encounterId = toEncounterID(encounterIdQuery);
    if (!await encounters.exists(encounterId)) {
      return notFound('Encounter not found');
    }
    const encounter = await encounters.get(encounterId);
    return ok(JSON.stringify(encounter));
  });

  const createEncounter = createLoggedRESTRoute('/encounters', async (queries, _, body) => {
    const encounterPost = toEncounterPostBody(JSON.parse(await readStream(body)));
    const encounter = await encounters.create(encounterPost.title, toUserID(''));
    return ok(JSON.stringify(encounter));
  }, 'POST');

  const postDeclareAction = createLoggedRESTRoute('/encounters/declare', async (queries, _, body) => {
    const [, encounterIdQuery] = queries.find(([name]) => name === 'encounterId') || [, null];
    if (encounterIdQuery === null) {
      return badInput('Missing ?encounterID query');
    }
    const encounterId = toEncounterID(encounterIdQuery);
    const { description, creatureId } = toDeclareActionPostBody(JSON.parse(await readStream(body)));
    await encounters.declareAction(encounterId, description, toCreatureId(creatureId), toUserID(''));
    return ok('');
  }, 'POST');

  return [
    getEncounter,
    createEncounter,
    postDeclareAction,
  ];
};

module.exports = {
  createEncounterRoutes,
};