import React, { Component } from 'react';
import TreeNode from './TreeNode';
import './Tree.css';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Redirect} from 'react-router-dom'

const apiUrlBase = 'https://api.myinnerwork.com';

class Tree extends Component {

  constructor(props) {
    super(props);

    const { match } = props;
    console.log(match);

    this.state = {
      tree: {
        nodeName: 'Tree',
        children: []
      }
    };
    // const exampleState = {
    //   tree: {
    //     nodeName: 'Tree',
    //     children: [
    //       {
    //         nodeName: 'A',
    //         children: [
    //           {
    //             nodeName: 'a',
    //             children: [
    //               {
    //                 nodeName: "a'",
    //                 children: []
    //               },
    //               {
    //                 nodeName: "b'",
    //                 children: []
    //               }
    //             ]
    //           },
    //           {
    //             nodeName: 'b',
    //             children: []
    //           },
    //           {
    //             nodeName: 'c',
    //             children: []
    //           }
    //         ]
    //       },
    //       {
    //         nodeName: 'B',
    //         children: []
    //       },
    //       {
    //         nodeName: 'C',
    //         children: []
    //       }
    //     ]
    //   }
    // };


    this.handleSubmit = this.handleSubmit.bind(this);
  }


  static addEditableNodes(tree) {
    if (tree.children.length > 0) {
      tree.children.forEach(function(child) {
        Tree.addEditableNodes(child);
      });
    }
    tree.children.push({nodeName: '', canEdit: true, children: []});

  }

  static addEditableAttribute(tree, isEditable) {
    if (tree.children.length > 0) {
      tree.children.forEach(function(child) {
        Tree.addEditableAttribute(child, isEditable);
      });
    }
    tree.canEdit = isEditable;
  }

  componentDidMount() {
    // request the current tree and set it to state
    const { match } = this.props;

    const newTree = Object.assign({}, this.state.tree);
    if (match.path === '/:id/edit' || match.path === '/:id') {
      const id = match.params.id;
      axios.get(`${apiUrlBase}/trees/${id}`)
        .then(({ data: tree }) => {

          if (match.path === '/:id/edit') {
            Tree.addEditableAttribute(tree, true);
          } else {
            Tree.addEditableAttribute(tree, false);
            Tree.addEditableNodes(tree);
          }
          this.setState({ tree });
        }).catch(console.log);
    } else {
      Tree.addEditableAttribute(newTree, false);
      Tree.addEditableNodes(newTree);
      this.setState({tree: newTree});
    }
  }

  static getReference(obj, path) {
    let result = obj;
    path.forEach(function(nodeName) {
      result = result.children.find(function(child) {
        return child.nodeName === nodeName;
      });

    });
    return result;
  }


  static cleanTree(tree) {
    if (tree.children.length > 0) {
      const filteredChildren = tree.children.filter( function(child) {
        return child.nodeName !== '';
      });
      tree.children = filteredChildren;
      tree.children.forEach(function(child) {
        Tree.cleanTree(child);
      });
    }
    delete tree.canEdit;
  }

  handleSubmit() {
    console.log('submit was pressed');
    const newTree = Object.assign({}, this.state.tree);
    Tree.cleanTree(newTree);
    console.log('state.tree', newTree);
    const { match } = this.props;
    if (match.params.id) {
      axios.put(`${apiUrlBase}/trees/${match.params.id}`, newTree).then(
        function (response) {
          window.location.replace(`/${response.data._id}`);
        }
      );
    } else {
      axios.post(`${apiUrlBase}/trees`, newTree).then(
        function (response) {
          window.location.replace(`/${response.data._id}`);
        }
      );
    }
    // save newTree in db
  }

  handleChange(path, event) {
    const newTree = Object.assign({}, this.state.tree);
    const node = Tree.getReference(newTree, path.slice(1));
    node.nodeName = event.target.value;
    this.setState({tree: newTree});
  }

  retrieveTreeElems(tree, elems, depth, path) {
    const self = this;
    path.push(tree.nodeName);
    const currentPath = path.slice();
    if (!tree.canEdit) {
      elems.push(<TreeNode key={elems.length} depth={depth} value={tree.nodeName}/>);
    } else {
      elems.push(<div key={`${elems.length}_input`} style={{marginLeft: `${depth * 30}px`}}><input type="text" name="test" value={tree.nodeName} onChange={self.handleChange.bind(self, currentPath)}/></div>);
    }
    if (tree.children.length > 0) {
      tree.children.forEach(function(child) {
        self.retrieveTreeElems(child, elems, depth + 1, path);
      });
    }
    path.pop();
  }

  render() {
    const elems = [];
    const path = [];
    this.retrieveTreeElems(this.state.tree, elems, 0, path);

    return (
      <div className ="TreeContainer">
        <div className="Tree">
          {elems}
        </div>
        <div className="submitHolder">
          <button onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

Tree.propTypes = {
  type: PropTypes.string,
};

export default Tree;