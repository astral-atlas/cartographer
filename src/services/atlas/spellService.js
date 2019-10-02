// @flow strict
/*::
import type { STDMapStore } from '../storage';
import type { Config } from '../../models/config';
import type { EventLogger } from '../log.2';

import type { Result } from '@lukekaalim/result';
import type { Spell, SpellID } from '@astral-atlas/contour';
*/
const { join } = require('path');
const { fail, succeed } = require('@lukekaalim/result');
const { generateUUID } = require('../../models/uuid');
const { createDirectoryMapStore, createMemoryMapStore, createJSONModeledStorage } = require('../storage');
const { stringModel } = require('@lukekaalim/model');
const { spellModel } = require('@astral-atlas/contour');

/*::
type SpellServiceFailure = {
  message: string,
}

export type SpellService = {
  createSpell: () => Promise<Result<Spell, SpellServiceFailure>>,
  getAllSpells: () => Promise<Result<Array<Spell>, SpellServiceFailure>>,
  deleteSpell: (id: SpellID) => Promise<Result<void, SpellServiceFailure>>,
  editSpell: (spell: Spell) => Promise<Result<void, SpellServiceFailure>>,
};
*/

const createSpellServiceFromMapStore = (
  store/*: STDMapStore<SpellID, Spell>*/,
)/*: SpellService*/ => {
  const createSpell = async () => {
    const newSpell = {
      id: generateUUID(),
      name: 'untitled new spell',
      castingTime: { type: 'action' },
      components: [],
      description: 'This newly created spell does not have a description',
      level: 0,
    };
    const writeResult = await store.write(newSpell.id, newSpell);
    if (writeResult.type === 'failure')
      return fail({ message: `Writing to the spell store failed:\n${writeResult.failure.error.message}` });
    return succeed(newSpell);
  }
  const getAllSpells = async () => {
    const listResult = await store.list();
    if (listResult.type === 'failure')
      return fail({ message: `Listing the contents of the spell store failed:\n${listResult.failure.error.message}` });
    const spellIds = listResult.success;
    const spells = [];
    const failures = [];
    const spellsResults = await Promise.all(spellIds.map(id => store.read(id)));
    for (const spellResult of spellsResults) {
      if (spellResult.type === 'success') {
        spells.push(spellResult.success);
      } else {
        failures.push(spellResult.failure);
      }
    }
    if (failures.length > 0)
      return fail({ message: `One or more spells were failed to be retrieved` });
    return succeed(spells);
  }
  const deleteSpell = async (id) => {
    const destroyResult = await store.destroy(id);
    if (destroyResult.type === 'failure') {
      if (destroyResult.failure.type === 'not-found')
        return fail({ message: `The spell you wish to destroy does not exist.` });
      return fail({ message: `Destroying the spell failed:\n${destroyResult.failure.error.message}` });
    }
    return succeed();
  }
  const editSpell = async (spell) => {
    const writeResult = await store.write(spell.id, spell);
    if (writeResult.type === 'failure')
      return fail({ message: `Writing to the spell store failed:\n${writeResult.failure.error.message}` });
    return succeed();
  }

  return {
    createSpell,
    getAllSpells,
    deleteSpell,
    editSpell,
  }
};

const createSpellService = async (config/*: Config*/) => {
  switch(config.storage.type) {
    case 'local-json':
      return createSpellServiceFromMapStore(
        createJSONModeledStorage(
          await createDirectoryMapStore(join(config.storage.dir, 'spells')),
          spellModel,
          stringModel,
        )
      );
    case 'memory':
        return createSpellServiceFromMapStore(createMemoryMapStore());
    default:
      throw new Error(`"${config.storage.type}" storage type for the spell service`);
  }
};

module.exports = {
  createSpellService,
};
