// @flow
/*::
import type { SpellService } from '../services/atlas/spellService';
import type { EventLogger } from '../services/log.2';
import type { Config } from '../models/config';
import type { Route } from '@lukekaalim/server';
*/
const { createRoute, ok, badRequest, internalServerError } = require('@lukekaalim/server');
const { createSTDMiddlewareEnhancer } = require('./routeMiddleware');
const { spellModel } = require('@astral-atlas/contour');

const createSpellRoutes = (
  spellService/*: SpellService*/,
  logger/*: EventLogger*/,
  config/*: Config*/,
)/*: Array<Route>*/ => {
  const enhanceRoute = createSTDMiddlewareEnhancer(logger, config);

  const createSpellRoute = createRoute('/spells', 'POST', async () => {
    const spellResult = await spellService.createSpell();
    if (spellResult.type === 'success')
      return ok(JSON.stringify(spellResult.success, null, 2));
    console.error(spellResult.failure);
    return internalServerError('Something went wrong');
  });

  const listSpellsRoute = createRoute('/spells', 'GET', async () => {
    const spellResult = await spellService.getAllSpells();
    if (spellResult.type === 'success')
      return ok(JSON.stringify(spellResult.success, null, 2));
    console.error(spellResult.failure);
    return internalServerError('Something went wrong');
  });

  const deleteSpellsRoute = createRoute('/spells', 'DELETE', async ({ query }) => {
    const queryId = query.get('id');
    if (queryId === undefined)
      return badRequest('Please define an ?id=${id-of-spell-to-delete}');
    const spellResult = await spellService.deleteSpell(queryId);
    if (spellResult.type === 'success')
      return ok();
    console.error(spellResult.failure);
    return internalServerError('Something went wrong');
  });

  const editSpell = createRoute('/spells', 'PUT', async ({ body }) => {
    if (!body)
      return badRequest('Please include a JSON spell in the request body');
    const spellParseResult = spellModel.from(JSON.parse(body));
    if (spellParseResult.type === 'failure')
      return badRequest('Your spell was formatted badly');
    const spellResult = await spellService.editSpell(spellParseResult.success);
    if (spellResult.type === 'success')
      return ok();
    console.error(spellResult.failure);
    return internalServerError('Something went wrong');
  });

  const optionsSessionRoute = createRoute('/spells', 'OPTIONS', () => {
    return ok('', {
      'Access-Control-Allow-Methods': 'POST, PUT, DELETE, GET, OPTIONS'
    });
  })

  return [
    createSpellRoute,
    listSpellsRoute,
    deleteSpellsRoute,
    optionsSessionRoute,
    editSpell,
  ].map(route => enhanceRoute(route));
};

module.exports = {
  createSpellRoutes,
};
