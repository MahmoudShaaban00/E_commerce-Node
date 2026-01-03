export class APIFeatures {
  constructor(mongooseQuery, searchQuery) {
    this.mongooseQuery = mongooseQuery;
    this.searchQuery = searchQuery;
  }

  // ===== FILTER =====
  filter() {
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'search'];
    let queryObj = { ...this.searchQuery };

    // remove excluded fields
    excludeFields.forEach(field => delete queryObj[field]);

    // advanced filter (gt, gte, lt, lte)
    const filterObj = this.normalizeFilter(queryObj);

    this.mongooseQuery = this.mongooseQuery.find(filterObj);
    return this;
  }

  // ===== NORMALIZE FILTER =====
  normalizeFilter(queryObj) {
    /*
      from:
      { price: { lt: '500' }, ratingsAverage: { gte: '4' } }

      to:
      { price: { $lt: 500 }, ratingsAverage: { $gte: 4 } }
    */

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      match => `$${match}`
    );

    return JSON.parse(queryStr);
  }

  // ===== SEARCH =====
  search() {
    if (this.searchQuery.search) {
      const searchTerm = this.searchQuery.search;
      this.mongooseQuery = this.mongooseQuery.find({
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      });
    }
    return this;
  }

  // ===== SORT =====
  sort() {
    if (this.searchQuery.sort) {
      this.mongooseQuery = this.mongooseQuery.sort(
        this.searchQuery.sort.split(',').join(' ')
      );
    }
    return this;
  }

  // ===== FIELDS =====
  fields() {
    if (this.searchQuery.fields) {
      this.mongooseQuery = this.mongooseQuery.select(
        this.searchQuery.fields.split(',').join(' ')
      );
    }
    return this;
  }

  // ===== PAGINATION =====
  pagination() {
    let pageNumber = this.searchQuery.page * 1 || 1;
    if (pageNumber < 1) pageNumber = 1;

    const limit = 2;
    const skip = (pageNumber - 1) * limit;

    this.pageNumber = pageNumber;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}
