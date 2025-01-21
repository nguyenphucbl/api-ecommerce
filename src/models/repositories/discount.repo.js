"use strict";

const { unSelectData, getSelectData } = require("../../utils");

const findAllDiscountUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  unSelect,
  filter,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unSelectData(unSelect))
    .lean();
  return documents;
};
const findAllDiscountSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  select,
  filter,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return documents;
};
const findOneDiscount = async ({ filter, model }) => {
  const document = await model.findOne(filter).lean();
  return document;
};
module.exports = {
  findAllDiscountUnSelect,
  findOneDiscount,
};
