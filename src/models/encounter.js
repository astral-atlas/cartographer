// @flow strict
/*::
import type { UUID } from './uuid';
import type { CreatureID } from './creature';
import type { UserID } from './user';
import type { DiceAmount } from './dice';
*/
const { toObject, toAString, toArray, toDisjointUnion } = require('@lukekaalim/to');
const { toUUID, generateUUID } = require('./uuid');
const { toDiceAmount } = require('./dice');
const { toCreatureId } = require('./creature');
const { toUserID } = require('./user');

/*::
export opaque type EncounterID: UUID = UUID;

type EncounterSetCreaturesAction = {
  type: 'encounter-set-creatures',
  creatures: Array<CreatureID>,
  createdBy: UserID,
};

type EncounterDeclareAction = {
  type: 'action-declare',
  actionDescription: string,
  creature: CreatureID,
  createdBy: UserID,
};

type EncounterRollDiceAction = {
  type: 'action-roll-dice',
  dice: DiceAmount,
  title: string,
  creature: CreatureID,
  createdBy: UserID,
};

type EncounterSpeakAction = {
  type: 'action-speak',
  textSpoken: string,
  creature: CreatureID,
  createdBy: UserID,
};

type EncounterAction =
  | EncounterSetCreaturesAction
  | EncounterDeclareAction
  | EncounterRollDiceAction
  | EncounterSpeakAction;

export type Encounter = {
  id: EncounterID,
  title: string,
  actions: Array<EncounterAction>,
};
*/

const toEncounterID = (value/*: mixed*/)/*: EncounterID*/ => toUUID(value);

const createDeclareAction = (
  creature/*: CreatureID*/,
  createdBy/*: UserID*/,
  actionDescription/*: string*/
)/*: EncounterDeclareAction*/ => ({
  type: 'action-declare',
  creature,
  createdBy,
  actionDescription,
});

const toDeclareAction/*: mixed => EncounterDeclareAction*/ = toObject({
  type: () => 'action-declare',
  creature: toCreatureId,
  createdBy: toUserID,
  actionDescription: toAString,
});

const toRollDiceAction/*: mixed => EncounterRollDiceAction*/ = toObject({
  type: () => 'action-roll-dice',
  title: toAString,
  dice: toDiceAmount,
  creature: toCreatureId,
  createdBy: toUserID,
});

const toSpeakAction/*: mixed => EncounterSpeakAction*/ = toObject({
  type: () => 'action-speak',
  textSpoken: toAString,
  creature: toCreatureId,
  createdBy: toUserID,
});

const toSetCreaturesAction/*: mixed => EncounterSetCreaturesAction*/ = toObject({
  type: () => 'encounter-set-creatures',
  creatures: toArray(toCreatureId),
  createdBy: toUserID,
});

const toEncounterAction = toDisjointUnion('type', {
  'action-declare': toDeclareAction,
  'action-speak': toSpeakAction,
  'encounter-set-creatures': toSetCreaturesAction,
  'action-roll-dice': toRollDiceAction,
});

const toEncounter/*: mixed => Encounter*/ = toObject({
  id: toEncounterID,
  title: toString,
  actions: toArray(toEncounterAction)
});

const createEncounter = (title/*: string*/, actions/*: Array<EncounterAction>*/ = [])/*: Encounter*/ => ({
  id: generateUUID(),
  title,
  actions,
});

module.exports = {
  createDeclareAction,
  createEncounter,
  toEncounter,
  toEncounterID,
  toDeclareAction,
};
