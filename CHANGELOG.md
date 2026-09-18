# Changelog

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0](https://github.com/leosuncin/nest-northwind-api/compare/v1.0.0...v2.0.0) (2026-09-18)


### Bug Fixes

* add shared module for feature where missing ([fb1f7ab](https://github.com/leosuncin/nest-northwind-api/commit/fb1f7ab998b2ab1785c333a8192a4f6632b08796))
* **order:** transform freight for consistent rounding ([0d2160a](https://github.com/leosuncin/nest-northwind-api/commit/0d2160a74e349f8583710b7a3087b57605efb198))
* round price before returning by the API ([155c179](https://github.com/leosuncin/nest-northwind-api/commit/155c1795dd28521b59245a47cc82410b5c4b5b53))
* throw a bad request exception when filters are invalid ([7060ee7](https://github.com/leosuncin/nest-northwind-api/commit/7060ee7adb091aba66b515cf543928bc8c52a9ea))
* transform the prices to a two decimal precision ([498330a](https://github.com/leosuncin/nest-northwind-api/commit/498330aa9c4d704544daa12c5d79c73f8657fe3a))


### Features

* **category:** implement the filtering of categories ([8cebb39](https://github.com/leosuncin/nest-northwind-api/commit/8cebb390e3be65c2e8684a139d5da0de22355dd2))
* **customer:** implement the filtering of customers ([d293708](https://github.com/leosuncin/nest-northwind-api/commit/d293708ea9fe0897becb7dc62bb919e26165933e))
* **employee:** implement the filtering of empoyees ([9a61e2d](https://github.com/leosuncin/nest-northwind-api/commit/9a61e2dda85fee3830d56bc6ee1eeed1a5e66dfb))
* **order:** implement the filtering of orders and order details ([86c63d6](https://github.com/leosuncin/nest-northwind-api/commit/86c63d60144b4175e27a7c8c2b6e1aa87de3e867))
* parse advanced filters before pass them to the handler ([b5d8782](https://github.com/leosuncin/nest-northwind-api/commit/b5d8782912fde36b24a88e6fda617bf7e6c6d14d))
* **product:** implement the filtering of products ([1493761](https://github.com/leosuncin/nest-northwind-api/commit/14937610f876f4636ba0a59ee1fdb1445daa0d0a))
* **shipper:** implement the filtering of shippers ([4a7ae6d](https://github.com/leosuncin/nest-northwind-api/commit/4a7ae6dc1a36037092f1170f5e71072b47f4153c))
* **supplier:** implement the filtering of suppliers ([2c9cc51](https://github.com/leosuncin/nest-northwind-api/commit/2c9cc51af528dff1cb5b324c54ff146188ea468b))


### Performance Improvements

* **shared:** simplify the registration of SchemaRegistry ([d8b63e1](https://github.com/leosuncin/nest-northwind-api/commit/d8b63e18f4329789c7076d22d35a2c8212c0579a))


### BREAKING CHANGES

* the services need to be modified

# 1.0.0 (2026-08-31)


### Bug Fixes

* **customer:** add ParseIntPipe to check if the id is a number ([9ad44d3](https://github.com/leosuncin/nest-northwind-api/commit/9ad44d3070bbbf05d80e3c0ea74701ee5bf47f7b))
* **database:** set the id in the customer's fixtures ([c81e891](https://github.com/leosuncin/nest-northwind-api/commit/c81e8911e9baa0371029cbb45feafe4d4cce3e15))
* **deps:** update dependency @nestjs/typeorm to v12 ([20cc9a6](https://github.com/leosuncin/nest-northwind-api/commit/20cc9a6f14de9e1569e832f7009951ac89b6cafd))
* **deps:** update nest monorepo to v12 ([59fb02d](https://github.com/leosuncin/nest-northwind-api/commit/59fb02d27c8bd4e56b37792d6fe88bd9c0ca32f5))
* **order:** amend update order detail DTO ([340f301](https://github.com/leosuncin/nest-northwind-api/commit/340f301d2dbd22e8cc991dd1ec3bc973a211ca24))
* **product:**  use relations and add validation checks ([5effdc6](https://github.com/leosuncin/nest-northwind-api/commit/5effdc6a18c312c812bd3988015abdf4ef467c2d))
* **product:** add missing foreign keys ([65c77c0](https://github.com/leosuncin/nest-northwind-api/commit/65c77c0a5f4df910348c9bf0533c3f997e728b4a))
* replace unused destructuring with Object.fromEntries in customer seeder ([3ed2b0f](https://github.com/leosuncin/nest-northwind-api/commit/3ed2b0f5b45a64f459b2608a150b04ae0c432707))


### Features

* add PositiveIntPipe for validating positive integers in query parameters ([54533c5](https://github.com/leosuncin/nest-northwind-api/commit/54533c5c50c1b2ce9e64cea4a2d9c037785395ca))
* add roundDateToDay utility ([4962175](https://github.com/leosuncin/nest-northwind-api/commit/49621750d40cc386649ce4fc44bd7f39a156395a))
* **category:** add validator to check the existence of a category ([b8dc706](https://github.com/leosuncin/nest-northwind-api/commit/b8dc7069578ce8507296e5cd2ba6ce13e9b64f35))
* **category:** implement the CRUD of categories ([c3851e5](https://github.com/leosuncin/nest-northwind-api/commit/c3851e5a2e551209bce9658a5dfe72ed7326c270))
* **customer:** add validator to check the existence of a customer ([691943b](https://github.com/leosuncin/nest-northwind-api/commit/691943b79fe91f680d66a4a533f87918520f6519))
* **customer:** implement the CRUD of customer ([f9b4df6](https://github.com/leosuncin/nest-northwind-api/commit/f9b4df6c6fcaddab3759331ac086ee35c4b992f0))
* **employee:** add validator to check the existence of a employee ([febb4e3](https://github.com/leosuncin/nest-northwind-api/commit/febb4e3043115c917671ab47b913f23ddbb94d14))
* **employee:** implement the CRUD of employees ([f5b73c3](https://github.com/leosuncin/nest-northwind-api/commit/f5b73c3f2f68278447f4b840429e2fb8484098cf))
* integrate TypeORM with MSSQL ([274f491](https://github.com/leosuncin/nest-northwind-api/commit/274f491f63f0bb33833c5943ff884bdaceb91bfc))
* **order:** add order module ([fa98f65](https://github.com/leosuncin/nest-northwind-api/commit/fa98f65565987a0d688e2514787d7fbfd7598433))
* **order:** create migration for order and order_detail tables ([583ae77](https://github.com/leosuncin/nest-northwind-api/commit/583ae7713d70ea48ee5d3909fff0cfa6a7347676))
* **product:** add validator to check the existence of a product ([5e34a17](https://github.com/leosuncin/nest-northwind-api/commit/5e34a17cb94e953e96168af8a7d57968c63f05d7))
* **product:** implement the API of product ([58dd231](https://github.com/leosuncin/nest-northwind-api/commit/58dd23108edbe0f3c7a1d85708a9f183cc8d351f))
* **product:** populate the category and supplier relationships in product creation ([b99c0a1](https://github.com/leosuncin/nest-northwind-api/commit/b99c0a1d42bb9b28773592cbaf275bd1f186d8e6))
* **product:** populate the relations for category and supplier when getting a product by id ([ddc5456](https://github.com/leosuncin/nest-northwind-api/commit/ddc545671d1be695ed606e768018edd3ac0923dd))
* **shared:** share pagination interceptor and entity not found filter ([6718da1](https://github.com/leosuncin/nest-northwind-api/commit/6718da1d383005c616989c67d7dc840ad590cb60))
* **shipper:** add shipper CRUD API with tests ([8ff718d](https://github.com/leosuncin/nest-northwind-api/commit/8ff718d85f66abcadecd434ff362cbc81a2c4480))
* **shipper:** add validator to check the existence of a shipper ([4137a3b](https://github.com/leosuncin/nest-northwind-api/commit/4137a3b6ad2c915c713bd4facae8e3d080a98179))
* **supplier:** add validator to check the existence of a supplier ([51c3b54](https://github.com/leosuncin/nest-northwind-api/commit/51c3b545a857868a9b282f4d7928a7fc96454fce))
* **supplier:** implement the API of supplier ([e32d5c8](https://github.com/leosuncin/nest-northwind-api/commit/e32d5c8d9c63be4fa0f25ffeaeee44723e573fa9))
* upgrade nest.js to v12 and ES modules ([bacb569](https://github.com/leosuncin/nest-northwind-api/commit/bacb569a6499a355c292114868a5222ff095954a))
