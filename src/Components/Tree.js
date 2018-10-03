import React, { Component } from 'react';
import TreeNode from './TreeNode';
import './Tree.css';



class Tree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tree: {
        A: {
          a: {
            "a'": {

            },
            "b'": {

            }
          },
          b: {

          },
          c: {

          }
        },
        B: {


        },
        C: {

        }
      }
    }
  }

  retrieveTreeElems(tree, elems, depth) {
    const entries = Object.entries(tree);
    const self = this;
    entries.forEach(function(entry, index) {
      // check for non-leaf nodes
      if (Object.keys(entry[1]).length !== 0) {
        elems.push(<TreeNode key={`${entry[0]}_${depth}`} depth={depth} value={entry[0]}/>);
        self.retrieveTreeElems(entry[1], elems, depth + 1);
        elems.push(<div style={{marginLeft: `${depth*30}px`}}><input type="text" name="test" value={entry[0]} /></div>);
      } else {
        elems.push(<TreeNode key={`${entry[0]}_${depth}`} depth={depth} value={entry[0]}/>);
        elems.push(<div style={{marginLeft: `${depth*30}px`}}><input type="text" name="test" value={entry[0]} /></div>);

      }
    });

  }

  render() {
    const elems = [];
    this.retrieveTreeElems(this.state, elems, 0);

    return (
      <div className="Tree">
        {elems}
      </div>
    );
  }
}

export default Tree;