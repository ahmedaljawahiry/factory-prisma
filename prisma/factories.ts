/**
 * Factories for testing purposes.
 */
import { PitchType, PlayerPosition, SquadType, TeamType } from "@prisma/client";
import { factory, random } from "../src";
import db from ".";

/**
 * Factory for the Team model, with random values for required fields.
 */
export const TeamFactory = factory(db.team, () => ({
  name: random.string(),
  key: random.string(),
  type: TeamType.CLUB,
  website: random.url(),
}));

/**
 * Factory for the Squad model, with random values for required fields.
 */
export const SquadFactory = factory(db.squad, () => ({
  team: { create: TeamFactory.fields() },
  type: SquadType.SENIOR_MEN,
}));

/**
 * Factory for the Player model, with random values for required fields.
 */
export const PlayerFactory = factory(db.player, () => ({
  key: random.string(),
  name: random.string(),
  dob: random.date(),
  position: PlayerPosition.CM,
}));

/**
 * Factory for the Stadium model, with random values for required fields.
 */
export const StadiumFactory = factory(db.stadium, () => ({
  name: random.string(),
  key: random.string(),
  capacity: random.int(),
}));

/**
 * Factory for the Pitch model, with random values for required fields.
 */
export const PitchFactory = factory(db.pitch, () => ({
  stadium: { create: StadiumFactory.fields() },
  surfaceType: PitchType.GRASS,
  width: random.float(),
  length: random.float(),
}));
