import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const credentialsPath = path.join(__dirname, '/../../../credentials/watsonx_ai_ml_vml_v1.env');
config({ path: credentialsPath });

/**
 * This is an alternative authentication method. To use it, please remove the following properties
 * from the Watsonx instance initialization: watsonxAIApikey, watsonxAIAuthType
 */
// process.env.IBM_CREDENTIALS_FILE = path.join(__dirname, '/../../../credentials/watsonx_ai_ml_vml_v1.env')
