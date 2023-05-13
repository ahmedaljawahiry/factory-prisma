/**
 * Tests verifying the instance() function.
 */
import { describe, expect, test } from "vitest";
import db from "../prisma";
import {
  PitchFactory,
  PlayerFactory,
  SquadFactory,
  StadiumFactory,
  TeamFactory,
} from "../prisma/factories";

describe("Created", () => {
  test("no relations", async () => {
    await TeamFactory.instance();

    expect(await db.team.count()).toBe(1);
  });

  test("with relations", async () => {
    await SquadFactory.instance();

    const team = await db.team.findFirstOrThrow();
    const squad = await db.squad.findFirstOrThrow();

    expect(await db.team.count()).toBe(1);
    expect(await db.squad.count()).toBe(1);
    expect(team.id).toBe(squad.teamId);
  });

  test("connected", async () => {
    const { id } = await TeamFactory.instance();
    await SquadFactory.instance({ team: { connect: { id } } });

    const team = await db.team.findFirstOrThrow();
    const squad = await db.squad.findFirstOrThrow();

    expect(await db.team.count()).toBe(1);
    expect(await db.squad.count()).toBe(1);
    expect(team.id).toBe(squad.teamId);
  });
});

describe("Values", () => {
  test("no relation", async () => {
    const team = await TeamFactory.instance();

    expect(team.name).not.toBeNull();
    expect(team.key).not.toBeNull();
    expect(team.type).not.toBeNull();
    expect(team.website).not.toBeNull();
    expect(team.motto).toBeNull();
    expect(team.description).toBeNull();
    expect(team.stadiumId).toBeNull();
  });

  test("with relation", async () => {
    const squad = await SquadFactory.instance();
    const team = await db.team.findFirstOrThrow();

    expect(squad.type).not.toBeNull();
    expect(team.name).not.toBeNull();
    expect(team.key).not.toBeNull();
    expect(team.type).not.toBeNull();
    expect(team.website).not.toBeNull();
    expect(team.motto).toBeNull();
    expect(team.description).toBeNull();
  });

  test("with values", async () => {
    const dob = new Date();
    const player = await PlayerFactory.instance({
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

  test("with relation values", async () => {
    const stadium = await StadiumFactory.instance({
      name: "Emirates Stadium",
      key: "emirates-stadium",
      capacity: 60704,
      pitch: {
        create: PitchFactory.fields({
          surfaceType: "GRASS",
          width: 68,
          length: 105,
          stadium: undefined,
        }),
      },
    });

    const pitch = await db.pitch.findFirstOrThrow({
      where: { id: stadium.id },
    });

    expect(stadium.name).toBe("Emirates Stadium");
    expect(stadium.key).toBe("emirates-stadium");
    expect(stadium.capacity).toBe(60704);
    expect(pitch.surfaceType).toBe("GRASS");
    expect(pitch.width).toBe(68);
    expect(pitch.length).toBe(105);
  });
});
