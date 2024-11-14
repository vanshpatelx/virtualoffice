import * as os from 'os';

let counter = 0;

function generateUniqueId(): bigint {
  const hostname = os.hostname().replace(/\D/g, '').slice(0, 4);
  const timestamp = Date.now();
  const counterValue = (++counter % 1000);  // range [0, 1000]

  const uniqueIdString = 
    hostname.padStart(4, '0') + 
    timestamp.toString() +    // timestaps milliseconds
    counterValue.toString().padStart(3, '0');

  const uniqueId = BigInt(uniqueIdString);
  return uniqueId;
}

export {generateUniqueId};
