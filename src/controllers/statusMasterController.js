const { StatusMaster } = require("../models");
const { Op } = require("sequelize");
const { formatStatusName, generateStatusCode } = require("../utils/util");

// create status  master
const createStatus = async (req, res) => {
  const { name } = req.body;
  if (!name?.trim())
    return res.status(400).json({ message: "Status name is required" });
  const normalisedName = name?.trim()?.replace(/\s+/g, " ")?.toLowerCase();
  try {
    const existingName = await StatusMaster.findOne({
      where: {
        name: {
          [Op.like]: normalisedName,
        },
      },
    });

    if (existingName) {
      return res.status(400).json({ message: "Status already exist" });
    }

    const nameTitleCased = formatStatusName(normalisedName);
    const StatusCode = generateStatusCode(normalisedName);

    await StatusMaster.create({
      name: nameTitleCased,
      code: StatusCode,
    });

    return res.status(201).json({ message: "New Status created" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// update status master


const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name?.trim())
    return res.status(400).json({ message: "Status name is required" });
  const normalisedName = name?.trim()?.replace(/\s+/g, " ")?.toLowerCase();
  try {
    const existingStatus = await StatusMaster.findOne({
      where: { id },
    });
    if (!existingStatus) {
      return res.status(400).json({ message: "Status not found" });
    }

    const duplicate = await StatusMaster.findOne({
      where: {
        name: { [Op.like]: normalisedName },
        id: { [Op.ne]: id },
      },
    });

    if (duplicate) {
      return res.status(400).json({ message: "Status already exists" });
    } else {
      const formattedStatusName = formatStatusName(normalisedName);
      const statusCode = generateStatusCode(normalisedName);

      existingStatus.name = formattedStatusName;
      existingStatus.code = statusCode;

      await existingStatus.save();

      return res.status(200).json({
        message: "Status updated successfully",
        status: existingStatus,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// delete status master
const deleteStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const existingStatus = await StatusMaster.findOne({
      where: {
        id,
      },
    });
    console.log(existingStatus);
    if (!existingStatus) {
      return res.status(404).json({ message: "Status not found" });
    }

    existingStatus.deleted = 1;
    await existingStatus.save();
    return res.status(200).json({ message: "Status deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// get all status master
const getAllStatus = async (req, res) => {
  try {
    const allRecords = await StatusMaster.findAll({ where: { deleted: 0 } });
    return res
      .status(200)
      .json({ message: "Data retrieved successfully", data: allRecords });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// get status by id
const getStatusById = async (req, res) => {
  const { id } = req.params;
  try {
    const status = await StatusMaster.findOne({ where: { id: id } });

    if (!status) return res.status(404).json({ message: "Status not found" });

    return res
      .status(200)
      .json({ message: "Data retrieved successfully", data: status });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createStatus,
  updateStatus,
  deleteStatus,
  getAllStatus,
  getStatusById,
};
