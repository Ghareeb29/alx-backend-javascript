import readDatabase from '../utils';

class StudentsController {
  static async getAllStudents(request, response) {
    try {
      const students = await readDatabase(process.argv[2]);
      let output = 'This is the list of our students\n';
      const sortedFields = Object.keys(students).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
      
      for (const field of sortedFields) {
        const count = students[field].length;
        const names = students[field].join(', ');
        output += `Number of students in ${field}: ${count}. List: ${names}\n`;
      }
      
      response.status(200).send(output.trim());
    } catch (error) {
      response.status(500).send('Cannot load the database');
    }
  }

  static async getAllStudentsByMajor(request, response) {
    const { major } = request.params;
    if (major !== 'CS' && major !== 'SWE') {
      return response.status(500).send('Major parameter must be CS or SWE');
    }

    try {
      const students = await readDatabase(process.argv[2]);
      const majorStudents = students[major] || [];
      response.status(200).send(`List: ${majorStudents.join(', ')}`);
    } catch (error) {
      response.status(500).send('Cannot load the database');
    }
  }
}

export default StudentsController;
