class BaseController {
  constructor(model) {
    this.model = model;
  }
  
  async getAll(req, res) {
    try {
      const data = await this.model.find({});
      res.json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getById(req, res) {
    try {
      const data = await this.model.findById(req.params.id);
      res.json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async create(req, res) {
    try {
      const data = await this.model.create(req.body);
      res.json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async update(req, res) {
    try {
      const data = await this.model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async delete(req, res) {
    try {
      await this.model.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = BaseController;
