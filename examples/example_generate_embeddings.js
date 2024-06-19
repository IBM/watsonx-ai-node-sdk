/**
 * The following example flow:
 * - initialize SDK
 * - list all available embedding models
 * - generate embedding vectors for input using two different models
 * - compare generated embedding vectors
 */

/**
 * Use 'import ...' statement if you want to use the sample in the module
 * and comment 'const watsonxAI...' statement
 * 
**/

const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');

// Service instance
let watsonxAIService;

process.env.IBM_CREDENTIALS_FILE = './auth/watsonx_ai_ml_vml_v1.env';
watsonxAIService = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl: 'https://us-south.ml.cloud.ibm.com',

});

async function generateEmbeddingsAndCompare() {

    // Get available embedding models
    const listModelParams = {
        'filters': "function_embedding"
    }

    const listModels = await watsonxAIService.listFoundationModelSpecs(listModelParams)
    const modelList = listModels.result.resources.map(model => model.model_id);
    console.log("\n\n***** LIST OF AVAILABLE EMBEDDING MODELS *****");
    console.log(modelList);

    // Get two first available embedding models
    model1 = modelList[0];
    model2 = modelList[1];

    // Specify input data
    const input = "You should be able to notice a difference between how the models are generating embedding vector for the same input."

    // Tokenize input data on 1st model
    const textEmbeddingParameters1 = {
        inputs: [input],
        modelId: model1,
        spaceId: '<SPACE_ID>'
    }
    const embedding1 = await watsonxAIService.textEmbeddings(textEmbeddingParameters1)
    embedding_vector1 = embedding1.result.results
    console.log("\n\n***** EMBEDDING VECTOR FROM 1ST MODEL *****");
    console.log(embedding_vector1);

    // Tokenize input data on 2nd model
    const textEmbeddingParameters2 = {
        inputs: [input],
        modelId: model2,
        spaceId: '<SPACE_ID>'
    }
    const embedding2 = await watsonxAIService.textEmbeddings(textEmbeddingParameters2)
    embedding_vector2 = embedding2.result.results
    console.log("\n\n***** EMBEDDING VECTOR FROM 2ND MODEL *****");
    console.log(embedding_vector2);

}

// Execute example function
generateEmbeddingsAndCompare()
