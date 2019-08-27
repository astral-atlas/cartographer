// @flow strict

/*::
type NodeMemoryUsage = {
  heapTotal: number,
  heapUsed: number,
  external: number
}

export type HeartbeatEvent = {
  type: 'heartbeat',
  mem: NodeMemoryUsage,
};
*/

const heartbeat = (
  mem/*: NodeMemoryUsage*/
) => ({
  type: 'heartbeat',
  mem,
});

module.exports = {
  heartbeat,
};
