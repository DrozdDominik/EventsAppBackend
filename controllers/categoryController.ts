import { Request, Response } from 'express';
import { CategoryRecord } from '../records/category.record';
import { CategoryEntity } from '../types';
import { AppError } from '../utils/error';
import { validate } from 'uuid';

export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await CategoryRecord.getAll();
  res.json({ categories });
};

export const addCategory = async (req: Request, res: Response) => {
  const requestData = req.body as CategoryEntity;

  if (!(await CategoryRecord.findOne(requestData.name))) {
    throw new AppError('Category already exists', 400);
  }

  const category = new CategoryRecord(requestData);
  const categoryId = await category.insert();

  res.status(201).json(categoryId);
};

export const getCategory = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!validate(id)) {
    throw new AppError('Provided invalid event id', 400);
  }

  const category = await CategoryRecord.getOne(id);

  if (!category) {
    throw new AppError('There is no category with the given id', 404);
  }

  res.json({ category });
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  const requestName: string = req.body;

  if (!validate(id)) {
    throw new AppError('Provided invalid event id', 400);
  }

  const category = await CategoryRecord.getOne(id);

  if (!category) {
    throw new AppError('There is no category with the given id', 404);
  }

  if (!(await CategoryRecord.findOne(requestName))) {
    throw new AppError('Category already exists', 400);
  }

  category.categoryName = requestName;

  if (!(await category.update())) {
    throw new AppError('Sorry update operation failed.', 500);
  }

  res.json(true);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!validate(id)) {
    throw new AppError('Provided invalid event id', 400);
  }

  const category = await CategoryRecord.getOne(id);

  if (!category) {
    throw new AppError('There is no category with the given id', 404);
  }

  if (!(await category.delete())) {
    throw new AppError('Sorry delete operation failed.', 500);
  }

  res.status(204).json(null);
};
