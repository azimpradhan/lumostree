import React from "react";
import PropTypes from 'prop-types';

import './TreeNode.css';


function TreeNode(props) {
  return (
    <div className="TreeNode" style={{marginLeft: `${props.depth*30}px`}}>
      {props.value}
    </div>
  );
}

TreeNode.propTypes = {
  depth: PropTypes.number,
  value: PropTypes.string
};

export default TreeNode;