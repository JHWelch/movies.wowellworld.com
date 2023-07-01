import DateUtils from '../data/dateUtils.js';

class DashboardController {
  static async index(_req, res) {
    res.render('index', {
      currentWeek: DateUtils.getThursday(),
      upcoming: DateUtils.getNextTwoThursdays(),
    });
  }
}

export default DashboardController;
