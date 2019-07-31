// @flow
/*::
import type { Encounter, EncounterID } from '../../models/encounter';
import type { UserID } from '../../models/user';
import type { CreatureID } from '../../models/creature';
import type { DiceAmount } from '../../models/dice';
import type { Storage } from '../storage.2';

*/
const { createEncounter, createDeclareAction } = require('../../models/encounter');

/*::
export type EncounterService = {
  create: (title: string, blame: UserID) => Promise<Encounter>,
  speak: (id: EncounterID, text: string, creature: CreatureID, blame: UserID) => Promise<void>,
  setCreatures: (id: EncounterID, creatures: Array<CreatureID>, blame: UserID) => Promise<void>,
  declareAction: (id: EncounterID, description: string, creature: CreatureID, blame: UserID) => Promise<void>,
  rollDice: (id: EncounterID, dice: DiceAmount, creature: CreatureID, blame: UserID) => Promise<void>,
  get: (id: EncounterID) => Promise<Encounter>,
  exists: (id: EncounterID) => Promise<boolean>,
};
*/

class UnimplementedServiceError extends Error {
  constructor() {
    super('Have not implemented that service method yet');
  }
}

const createEncounterService = (
  storage/*: Storage<EncounterID, Encounter> */,
)/*: EncounterService*/ => {
  const create = async (title, blame) => {
    const encounter = createEncounter(title);
    await storage.write(encounter.id, encounter);
    return encounter;
  };
  const speak = async () => {
    throw new UnimplementedServiceError();
  };
  const setCreatures = async () => {
    throw new UnimplementedServiceError();
  };
  const declareAction = async (id, description, creature, blame) => {
    const encounter = await storage.read(id);
    const actions = [
      ...encounter.actions,
      createDeclareAction(creature, blame, description),
    ];
    await storage.write(id, { ...encounter, actions });
    
  };
  const rollDice = async (id, dice, creature, blame) => {
    throw new UnimplementedServiceError();
  };
  const get = async (id) => {
    return await storage.read(id);
  };
  const exists = async (id) => {
    return await storage.has(id);
  }

  return {
    create,
    speak,
    setCreatures,
    declareAction,
    rollDice,
    get,
    exists,
  }
};

module.exports = {
  createEncounterService,
};
