/* Representative fixtures for V2 resolver validation.
 * These are engine fixtures, not the final 864-question dataset.
 */
(function (global) {
  'use strict';

  const scenarios = [
    {
      id: 'G0_R1_SS_GB',
      outs: 0,
      ball: { type: 'GROUND_BALL', zone: 'SS', fielder: 'SS' },
      runners: [{ id: 'R1', base: '1B' }],
      player: { runnerId: 'R1' },
      expected: { ADVANCE: { defenseBase: '2B', reason: 'FORCE_PLAY_PRIORITY' } }
    },
    {
      id: 'G1_R1_SS_GB',
      outs: 1,
      ball: { type: 'GROUND_BALL', zone: 'SS', fielder: 'SS' },
      runners: [{ id: 'R1', base: '1B' }],
      player: { runnerId: 'R1' },
      expected: { ADVANCE: { defenseBase: '2B', reason: 'FORCE_PLAY_PRIORITY' } }
    },
    {
      id: 'G0_R12_2B_GB_R2',
      outs: 0,
      ball: { type: 'GROUND_BALL', zone: '2B', fielder: '2B' },
      runners: [{ id: 'R1', base: '1B' }, { id: 'R2', base: '2B' }],
      player: { runnerId: 'R2' },
      expected: { ADVANCE: { defenseBase: '3B', reason: 'FORCE_PLAY_PRIORITY' } }
    },
    {
      id: 'G0_R123_3B_GB_R3',
      outs: 0,
      ball: { type: 'GROUND_BALL', zone: '3B', fielder: '3B' },
      runners: [{ id: 'R1', base: '1B' }, { id: 'R2', base: '2B' }, { id: 'R3', base: '3B' }],
      player: { runnerId: 'R3' },
      expected: { ADVANCE: { defenseBase: 'HOME', reason: 'FORCE_PLAY_PRIORITY' } }
    },
    {
      id: 'G0_R2_SS_GB_NONFORCE',
      outs: 0,
      ball: { type: 'GROUND_BALL', zone: 'SS', fielder: 'SS' },
      runners: [{ id: 'R2', base: '2B' }],
      player: { runnerId: 'R2' },
      expected: { ADVANCE: { defenseBase: '1B', reason: 'SECURE_BATTER_RUNNER' } }
    }
  ];

  global.RunnerKingV2Scenarios = scenarios;
  if (typeof module !== 'undefined' && module.exports) module.exports = scenarios;
})(typeof window !== 'undefined' ? window : globalThis);
