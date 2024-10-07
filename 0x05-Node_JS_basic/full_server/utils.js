import fs from 'fs/promises';

const readDatabase = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const lines = data.trim().split('\n');
    const [headers, ...studentLines] = lines;
    const fieldIndex = headers.split(',').indexOf('field');

    const students = {};
    for (const line of studentLines) {
      const fields = line.split(',');
      const field = fields[fieldIndex];
      const firstName = fields[0];
      
      if (!students[field]) {
        students[field] = [];
      }
      students[field].push(firstName);
    }

    return students;
  } catch (error) {
    throw new Error('Cannot load the database');
  }
};

export default readDatabase;
