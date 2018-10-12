import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';

import React from 'react';
import reactDom from 'react-dom';

import Events from './src/utils/Events';
import {create_index, serialize, sort, convert_data} from './src/utils/functions';

import {items, fields, sortBy, filterFunction} from './src/config';
import DataGrid from './src/DataGrid';

const rootDomComponent = document.getElementById('main-body');

class ResultListComponent  {

    constructor() {

        this._events = new Events();

        this._indexBy = 'gmx_id';
        this._sortBy = sortBy;

        this._createData(items);

        this._init();
    }

    getPreparedItems() {

        return sort(serialize (this._rawItems), this._sortBy.field, this._sortBy.asc);
    }


    _init() {

        reactDom.render(
            <DataGrid
                events={this._events}
                fields={fields}
                items={this.getPreparedItems()}
                sortBy={sortBy}
                indexBy="gmx_id"
                adjustMode="auto"
                align={true}
                filter={filterFunction}
                onSort={this._sort}
            />,
            rootDomComponent
        );
    }

    _createData(items) {

        const preparedItems = convert_data(items);

        this._rawItems = preparedItems.length > 0 ? create_index(preparedItems, this._indexBy) : {};
    }

    _sort(items, field, asc) {

    }

};

window.resultList = new ResultListComponent();