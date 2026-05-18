// const CustomerModel = require("../../models/CustomerModel");
const OwnerModel = require("../../models/OwnerModel");
const ServiceModel = require("../../models/ServiceModel");
const ProductModel = require("../../models/ProductModel");

exports.getAllServicesForGuest = async (req, res) => {
  try {

    const activeOwners = await OwnerModel.find({
      ownerAccountStatus: "ACTIVE",
      ownerApprovedStatus: "APPROVE",
    });

    if (activeOwners.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active salons found",
        data: [],
      });
    }

    const ownerIds = activeOwners.map((owner) => owner._id);

    const services = await ServiceModel.find({
      ownerId: { $in: ownerIds },
    }).populate(
      "ownerId",
      "ownerShopName ownerShopStreet ownerShopDistrict ownerShopCity ownerShopPincode ownerEmail"
    );

    return res.status(200).json({
      success: true,
      totalServices: services.length,
      data: services,
    });

  } catch (error) {
    console.error("Error in getAllServicesForGuest:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


exports.getAllProductsForGuest = async (req, res) => {
  try {
    // 1. Find all ACTIVE and APPROVED owners
    const activeOwners = await OwnerModel.find({
      ownerAccountStatus: "ACTIVE",
      ownerApprovedStatus: "APPROVE",
    });

    if (activeOwners.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No active shops found",
        data: [],
      });
    }

    // 2. Extract owner IDs
    const ownerIds = activeOwners.map((owner) => owner._id);

    // 3. Fetch all products belonging to these active owners
    const products = await ProductModel.find({
      ownerId: { $in: ownerIds },
    }).populate(
      "ownerId",
      "ownerShopName ownerEmail ownerShopCity ownerShopPincode"
    );


    return res.status(200).json({
      success: true,
      totalProducts: products.length,
      data: products,
    });

  } catch (error) {
    console.error("Error in getAllProductsForGuest:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
