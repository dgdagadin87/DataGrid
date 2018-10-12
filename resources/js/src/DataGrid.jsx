import '../../css/DataGrid.css';

import React, {Component} from 'react';
import PropTypes from 'prop-types';


class DataGrid extends Component {

    constructor(props) {
        super(props);
        
        const {fields} = props;
        this._fieldKeys = Object.keys(fields);

        this.state = this._setState(props);
    }

    _setState(state) {

        const {sortBy = {}, items = []} = state;

        return {
            sortBy,
            items
        };
    }

    _onHeaderClick(columnIndex) {

        const {fields} = this.props;
        const {sortBy = {}} = this.state;
        const {asc = false} = sortBy;

        const currentField = fields[columnIndex];

        if (!currentField.sortable) {
            return false;
        }

        this.setState({
            sortBy: {
                field: columnIndex,
                asc: !asc
            }
        }, () => console.log(this.state));
    }

    _getCellAlign (type) {

        switch (type){
            case 'integer':
            case 'float':
                return 'right';
            case 'selector':
            case 'button':
            case 'boolean':
            case 'color':
                return 'center';
            default:
                return 'left';
        }
    }

    _renderHeader() {

        const fieldKeys = this._fieldKeys;

        return (
            <div className="table-list-header">
                <table cellSpacing="0" cellPadding="0">
                    <colgroup>{fieldKeys.map(index => <col key={index} />)}</colgroup>
                    <tbody>
                        <tr>{fieldKeys.map(this._renderHeaderColumn.bind(this))}</tr>
                    </tbody>
                </table>
            </div>
        );
    }

    _renderHeaderColumn(columnIndex) {

        const {fields} = this.props;
        const {sortBy = {}} = this.state;
        const {field: sortField, asc = false} = sortBy;
        const field = fields[columnIndex];
        const {name, columnIcon, tooltip = '', sortable, width} = field;

        const sortType = asc ? 'up' : 'down';

        let innerElement = null;

        switch(field.type) {
            case 'selector':
                innerElement = <input className="table-list-tristate" type="checkbox" />;
                break;
            case 'boolean':
            case 'string':
                if (typeof name === 'string') {
                    innerElement = <span>{name}</span>;
                }
                else if (typeof columnIcon === 'string') {
                    innerElement = <i className={columnIcon} />;
                }
                break;
            case 'button':
                if (typeof columnIcon === 'string') {
                    innerElement = <i className={columnIcon} />;
                }
                else if (typeof name === 'string') {
                    innerElement = <span>{name}</span>;
                }
                break;
            default:
                if (typeof name === 'string') {
                    innerElement = <span>{name}</span>;
                }
                break;
        }

        return (
            <td
                key={columnIndex}
                title={tooltip}
                className="table-list-col"
                datafield={columnIndex}
                style={width ? {width: `${width}px`} : {}}
                onClick={this._onHeaderClick.bind(this, columnIndex)}
            >
                {innerElement}
                {sortable ? <i className={'table-list-sort' + (sortField === columnIndex ? ` table-list-sort-${sortType}` : '')} /> : null}
            </td>
        );
    }

    _renderBody() {

        const fieldKeys = this._fieldKeys;

        const {items = []} = this.state;

        if(items.length > 0) {

            return (
                <div className="table-list-body">
                    <table cellSpacing="0" cellPadding="0">
                        <colgroup>{fieldKeys.map(index => <col key={index} />)}</colgroup>
                        <tbody>{items.map(this._renderBodyRow.bind(this))}</tbody>
                    </table>
                </div>
            );
        }
        else {
            return null;
        }     
    }

    _renderBodyRow(item, key) {

        const fieldKeys = this._fieldKeys;

        //data-item-id
        return (
            <tr key={key}>{fieldKeys.map(this._renderBodyCell.bind(this, item))}</tr>
        );
    }

    _renderBodyCell(item, columnIndex) {

        const {fields, align} = this.props;
        const currentField = fields[columnIndex];

        const {width, type, align: fieldAlign, formatter, yes: fieldYes, no: fieldNo, styler, icon} = currentField;

        const cellAlign = align ? fieldAlign || this._getCellAlign(type) : '';    

        const renderCell = cellValue => <td key={columnIndex} style={{width: width + 'px', textALign: cellAlign}}>{cellValue}</td>;

        let currentCellValue = null;

        switch(type) {

            case 'selector':
                const cellValue = Boolean(item[columnIndex]);
                currentCellValue = <input type="checkbox" checked={cellValue} value={item[columnIndex]} />;
                break;

            case 'button':
                const {button: buttonClass} = currentField;
                currentCellValue = <i className={`table-list-button ${buttonClass}`} />;

            case 'boolean':
                const fieldValue = typeof formatter === 'function' ? formatter (item) : item[columnIndex];
                const cell = (fieldYes || fieldNo) ? <i className={`table-list-button ${icon} ${fieldValue ? (fieldYes || '') : (fieldNo || '')}`} /> : `${fieldValue ? '+' : ''}`;
                currentCellValue = cell;
                break;

            case 'color':
                currentCellValue = <div className="table-list-color" style={{borderColor: item[columnIndex] !== 'undefined' ? item[columnIndex] : '#ffffff'}}>&nbsp;</div>;
                break;
            
            default:                
                if (typeof styler === 'function') {                    
                    currentCellValue = <i className={styler(item)} />;
                }
                else {
                    const val = typeof formatter === 'function' ? formatter (item) : item[columnIndex];
                    //return `<td${align}><span>${val}</span>${field.edit ? '<i class="cell-edit"></i>' :''}</td>`;
                    currentCellValue = <span>{val}</span>;
                }
        }

        return renderCell(currentCellValue);
    }

    render() {

        return (
            <div className="results-pane result-list table-list">
                {this._renderHeader()}
                {this._renderBody()}
            </div>
        );
    }

}

DataGrid.propTypes = {
    events: PropTypes.object.isRequired,
    align: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    sortBy: PropTypes.object,
    filter: PropTypes.func,
    adjustMode: PropTypes.string,
    indexBy: PropTypes.any
}

export default DataGrid;