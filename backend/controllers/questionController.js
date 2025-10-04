const Question = require("../models/Questions");

// 📌 Add a new question
const addQuestion = async (req, res) => {
  try {
    const { subject, statement, options, correct } = req.body;

    if (!subject || !statement || !options || options.length === 0 || !correct) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const question = new Question({ subject, statement, options, correct });
    await question.save();

    res.status(201).json(question);
  } catch (err) {
    console.error("Error saving question:", err);
    res.status(500).json({ error: "Server error while saving question" });
  }
};

// 📌 Get questions by subject
const getQuestionsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const questions = await Question.find({
      subject: { $regex: new RegExp(subject, "i") } // case-insensitive match
    });
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching questions" });
  }
};
// 📌 Delete question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ error: "Server error while deleting question" });
  }
};

// 📌 Count questions by subject
const getQuestionsCount = async (req, res) => {
  try {
    const counts = await Question.aggregate([
      { $group: { _id: "$subject", count: { $sum: 1 } } },
    ]);
    res.json(counts);
  } catch (err) {
    console.error("Error fetching counts:", err);
    res.status(500).json({ error: "Server error while fetching counts" });
  }
};

module.exports = {
  addQuestion,
  getQuestionsBySubject,
  deleteQuestion,
  getQuestionsCount,
};
