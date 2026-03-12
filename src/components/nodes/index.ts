import StartNode from './StartNode';
import EndNode from './EndNode';
import ProcessStepNode from './ProcessStepNode';
import DecisionNode from './DecisionNode';
import SubprocessNode from './SubprocessNode';
import DelayNode from './DelayNode';

export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  processStep: ProcessStepNode,
  decision: DecisionNode,
  subprocess: SubprocessNode,
  delay: DelayNode,
};
