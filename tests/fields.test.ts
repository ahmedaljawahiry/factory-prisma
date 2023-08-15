/**
 * Tests verifying the fields() function.
 */
import { PlayerPosition } from "@prisma/client";
import { expect, test } from "vitest";
import db from "../prisma";
import {
  PitchFactory,
  PlayerFactory,
  SquadFactory,
  StadiumFactory,
  TeamFactory,
} from "../prisma/factories";
import { factory, random } from "../src";

test("no relation", () => {
  const team = TeamFactory.fields();

  expect(team.name).not.toBeUndefined();
  expect(team.key).not.toBeUndefined();
  expect(team.type).not.toBeUndefined();
  expect(team.website).not.toBeUndefined();
  expect(team.motto).toBeUndefined();
  expect(team.description).toBeUndefined();
  expect(team.stadium).toBeUndefined();
});

test("with relation", () => {
  const squad = SquadFactory.fields();

  expect(squad.type).not.toBeUndefined();
  expect(squad.team?.create?.name).not.toBeUndefined();
  expect(squad.team?.create?.key).not.toBeUndefined();
  expect(squad.team?.create?.type).not.toBeUndefined();
  expect(squad.team?.create?.website).not.toBeUndefined();
  expect(squad.team?.create?.motto).toBeUndefined();
  expect(squad.team?.create?.description).toBeUndefined();
  expect(squad.team?.create?.stadium).toBeUndefined();
});

test("with values", () => {
  const dob = new Date();
  const player = PlayerFactory.fields({
    name: "Bukayo Saka",
    nickname: "Starboy",
    key: "bukayo-saka",
    dob,
    position: "RW",
  });

  expect(player.name).toBe("Bukayo Saka");
  expect(player.key).toBe("bukayo-saka");
  expect(player.dob).toStrictEqual(dob);
  expect(player.position).toBe("RW");
});

test("with relation values", () => {
  const stadium = StadiumFactory.fields({
    name: "Emirates Stadium",
    key: "emirates-stadium",
    capacity: 60704,
    pitch: {
      create: PitchFactory.fields({
        surfaceType: "GRASS",
        width: 68,
        length: 105,
      }),
    },
  });

  expect(stadium.name).toBe("Emirates Stadium");
  expect(stadium.key).toBe("emirates-stadium");
  expect(stadium.capacity).toBe(60704);
  expect(stadium.pitch?.create?.surfaceType).toBe("GRASS");
  expect(stadium.pitch?.create?.width).toBe(68);
  expect(stadium.pitch?.create?.length).toBe(105);
});

test.each([
  [{ name: "Saka" }, PlayerPosition.RW],
  [{ name: "Raya" }, PlayerPosition.GK],
  [undefined, PlayerPosition.GK],
])("with conditional (%p)", (override, result) => {
  const conditionalFactory = factory(db.player, (overrides) => ({
    key: random.string(),
    name: random.string(),
    dob: random.date(),
    position:
      overrides?.name === "Saka" ? PlayerPosition.RW : PlayerPosition.GK,
  }));

  const player = conditionalFactory.fields(override);

  expect(player.position).toBe(result);
});
