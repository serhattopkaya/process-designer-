import StartNode from './StartNode';
import EndNode from './EndNode';
import ProcessStepNode from './ProcessStepNode';
import DecisionNode from './DecisionNode';
import SubprocessNode from './SubprocessNode';
import DelayNode from './DelayNode';
import PlcNode from './PlcNode';
import PlcDataReaderNode from './PlcDataReaderNode';
import MsSqlServerNode from './MsSqlServerNode';
import AzureFunctionNode from './AzureFunctionNode';
import RestApiNode from './RestApiNode';
import KafkaNode from './KafkaNode';

export const nodeTypes = {
  // Process Flow
  start: StartNode,
  end: EndNode,
  processStep: ProcessStepNode,
  decision: DecisionNode,
  subprocess: SubprocessNode,
  delay: DelayNode,
  // Solution Designer
  plc: PlcNode,
  plcDataReader: PlcDataReaderNode,
  msSqlServer: MsSqlServerNode,
  azureFunction: AzureFunctionNode,
  restApi: RestApiNode,
  kafka: KafkaNode,
};
