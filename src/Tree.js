import React, { useContext } from 'react'
import { Tree } from 'antd';
import 'antd/dist/antd.css';
import AppContext from './AppContext';


function TreeDiv(props) {

    const {
        contextDispatch
    } = useContext(AppContext)

    if (props.model) {
        console.log('MODEL', props.model)
    }

    const onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);

        
    };

    const onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
        // console.log('node', info.node)
        // info.node.visible = false
        
        contextDispatch({ type: 'check', checkedKeys: checkedKeys })
    };

    return !props.tree ? null :
        <div style={{ position: "relative", left: 0, top: 0 }}>
            {
                props.tree && props.tree ?
                    <Tree
                        checkable
                        // defaultExpandedKeys={['0-0-0', '0-0-1']}
                        // defaultSelectedKeys={['0-0-0', '0-0-1']}
                        // defaultCheckedKeys={['0-0-0', '0-0-1']}
                        onSelect={onSelect}
                        defaultExpandAll={false}
                        onCheck={onCheck}
                        treeData={props.tree}>

                    </Tree>
                    :
                    <p>{'loading tree'}</p>

            }

        </div>


}

export default TreeDiv