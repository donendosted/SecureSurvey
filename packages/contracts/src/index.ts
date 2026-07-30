export { SurveyRegistryContract } from './survey-registry';
export { ResponseRegistryContract } from './response-registry';
export { ZKVerifierContract } from './zk-verifier';
export { compileContracts, deployContracts } from './deploy';

export interface CompiledContract {
  name: string;
  abi: any;
  bytecode: string;
  source: string;
}

export interface ContractDeployment {
  address: string;
  transactionHash: string;
  blockNumber: number;
  contract: CompiledContract;
}
