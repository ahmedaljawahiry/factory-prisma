# factory-prisma

[![Test](https://github.com/ahmedaljawahiry/factory-prisma/actions/workflows/test.yaml/badge.svg?branch=main)](https://github.com/ahmedaljawahiry/factory-prisma/actions/workflows/test.yaml)
[![Coverage](https://img.shields.io/badge/coverage%20-100%25-brightgreen.svg)](https://github.com/ahmedaljawahiry/factory-prisma/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/factory-prisma.svg)](https://www.npmjs.com/package/factory-prisma)
[![npm license](https://img.shields.io/npm/l/factory-prisma.svg)](https://www.npmjs.com/package/factory-prisma/blob/main/LICENSE)

Create factories, that create objects with [Prisma](https://github.com/prisma/prisma).

Inspired by Python's [factory_boy](https://github.com/FactoryBoy/factory_boy),
which is inspired by Ruby's [factory_bot](https://github.com/thoughtbot/factory_bot).

### Usage

Install `factory-prisma` as a dev dependency, then use it to define
factories for your Prisma models.

```typescript
import db from 'wherever/your/prisma/client/is'
import { factory, random } from 'factory-prisma'

export const TeamFactory = factory(db.team, () => ({
  name: random.string(),  // use faker if you want to
  key: random.string(),
  type: TeamType.CLUB,
  website: random.url(),
}));

export const SquadFactory = factory(db.squad, () => ({
  team: { create: TeamFactory.fields() },
  type: SquadType.SENIOR_MEN,
}));

export const PlayerFactory = factory(db.player, () => ({
  key: random.string(),
  name: random.string(),
  dob: random.date(),
  position: PlayerPosition.CM,
}));
```

Then, use the factories in your tests:

```typescript
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

test("connect", async () => {
    const { id } = await TeamFactory.instance();
    await SquadFactory.instance({ team: { connect: { id } } });
    
    const team = await db.team.findFirstOrThrow();
    const squad = await db.squad.findFirstOrThrow();
    
    expect(await db.team.count()).toBe(1);
    expect(await db.squad.count()).toBe(1);
    expect(team.id).toBe(squad.teamId);
});
```
