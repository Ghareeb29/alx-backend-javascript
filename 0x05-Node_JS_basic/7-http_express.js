const express = require('express');
const fs = require('fs').promises;

const app = express();
const port = 1245;

const countStudents = async (dataPath) => {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    const fileLines = data.trim().split('\n');
    const studentGroups = {};
    const dbFieldNames = fileLines[0].split(',');
    const studentPropNames = dbFieldNames.slice(0, dbFieldNames.length - 1);

    for (const line of fileLines.slice(1)) {
      const studentRecord = line.split(',');
      const studentPropValues = studentRecord.slice(0, studentRecord.length - 1);
      const field = studentRecord[studentRecord.length - 1];
      if (!Object.keys(studentGroups).includes(field)) {
        studentGroups[field] = [];
      }
      const studentEntries = studentPropNames
        .map((propName, idx) => [propName, studentPropValues[idx]]);
      studentGroups[field].push(Object.fromEntries(studentEntries));
    }

    const totalStudents = Object
      .values(studentGroups)
      .reduce((pre, cur) => (pre || []).length + cur.length);

    let output = `Number of students: ${totalStudents}\n`;
    for (const [field, group] of Object.entries(studentGroups)) {
      const studentNames = group.map((student) => student.firstname).join(', ');
      output += `Number of students in ${field}: ${group.length}. List: ${studentNames}\n`;
    }
    return output;
  } catch (error) {
    throw new Error('Cannot load the database');
  }
};

app.get('/', (req, res) => {
  res.send('Hello Holberton School!');
});

app.get('/students', async (req, res) => {
  const databasePath = process.argv[2];
  try {
    const output = await countStudents(databasePath);
    res.send(`This is the list of our students\n${output}`);
  } catch (error) {
    res.status(500).send(`This is the list of our students\n${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = app;
