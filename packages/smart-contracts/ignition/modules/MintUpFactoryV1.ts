import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('MintUpFactoryV1Module', (m) => {
  const mintUpFactoryV1 = m.contract('MintUpFactoryV1');

  m.call(mintUpFactoryV1, '');

  return { mintUpFactoryV1 };
});
