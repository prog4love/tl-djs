import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _throttle from 'lodash.throttle';
import { Form, Input, Tag } from 'antd';

const FormItem = Form.Item;
const { Search } = Input;

// const setStudiosFilterTextThrottled = _throttle(setStudiosFilterText, 1000, {
//   leading: true,
//   trailing: true
// });

// TODO: changeSearchTextDebounced = lo_debounce(this.handleSearchChange(e), 500);

class StudiosFilterForm extends Component {
  static propTypes = {
    addStudiosFilterTag: PropTypes.func.isRequired,
    form: PropTypes.instanceOf(Object).isRequired,
    removeStudiosFilterTag: PropTypes.func.isRequired,
    setStudiosFilterText: PropTypes.func.isRequired,
    tags: PropTypes.instanceOf(Array).isRequired
  }
  setStudiosFilterTextThrottled = _throttle(
    this.props.setStudiosFilterText,
    1000,
    // NOTE: trailing causes excess setting of field value on search event
    { leading: false, trailing: true }
  )
  handleAfterClose = tagName => () => {
    const { removeStudiosFilterTag } = this.props;
    removeStudiosFilterTag(tagName);
  }
  handleSearch = (value) => {
    // TODO: cancel or flush throttled ?
    this.setStudiosFilterTextThrottled.cancel();
    const val = value.trim();
    if (!val || val.length < 1) {
      // TODO: use provided by lib validation
      return;
    }
    const { addStudiosFilterTag, setStudiosFilterText, form } = this.props;
    // console.log('search value: ', val);
    addStudiosFilterTag(val);
    setStudiosFilterText('');
    form.setFieldsValue({ search: '' }); // OR: form.resetFields('search');
  }
  handleSearchChange = (e) => {
    // e.persist();
    // const { setStudiosFilterText } = this.props;
    // NOTE: form.getFieldValue('search') returns prev value here
    console.log('on search change e.target.value: ', e.target.value);
    this.setStudiosFilterTextThrottled(e.target.value);
  }
  handleSubmit = (e) => {
    e.preventDefault();
  }
  render() {
    const { form: { getFieldDecorator }, tags } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('search')(<Search
            onChange={this.handleSearchChange}
            onSearch={this.handleSearch}
            placeholder="Умный поиск"
          />)}
        </FormItem>
        <div>
          {tags.map((tag) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                name={tag}
                closable
                // onClose={this.handleTagClose}
                afterClose={this.handleAfterClose(tag)}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </Tag>
            );
            // return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
            return tagElem;
          })}
        </div>
        {/* <FormItem label="Username">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Username is required!' }],
          })(<Input />)}
        </FormItem> */}
      </Form>
    );
  }
}

export default Form.create({
  // onFieldsChange({ setStudiosFilterText }, changedFields) {
  //   console.log('changedFields.search.value: ', changedFields.search.value);
  //   setStudiosFilterText(changedFields.search.value);
  // },
  mapPropsToFields({ searchText }) {
    console.log('mapped searchText: ', searchText);
    return {
      search: Form.createFormField({
        value: searchText
      })
    };
  }
})(StudiosFilterForm);
