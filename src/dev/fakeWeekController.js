import fake from './fake.js';

class FakeWeekController {
  static async show(_req, res) {
    res.json(fake.week1);
  }
}

export default FakeWeekController;
