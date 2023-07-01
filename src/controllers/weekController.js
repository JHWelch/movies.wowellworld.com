class WeekController {
  constructor(notion) {
    this.notion = notion;
  }

  async show(req, res) {
    const week = await this.notion.getWeek(req.params.date);

    if (!week) {
      res.status(404).json({ error: 'Week not found' });
      return;
    }

    res.json(week.toDTO());
  }
}

export default WeekController;
