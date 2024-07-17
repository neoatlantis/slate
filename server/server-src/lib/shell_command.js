const { promisify } = require('util');
const exec = promisify(require('child_process').exec);



module.exports = async function (command){
    const result = await exec(command);
    return { stdout: result.stdout }
}