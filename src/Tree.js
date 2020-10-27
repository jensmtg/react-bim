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
        // console.log('onCheck', checkedKeys, info);
        // console.log('node', info.node)
        // info.node.visible = false
        contextDispatch({ type: 'visibility', id: info.node.uuid })
    };

    return !props.model ? null :
        <div style={{ position: "absolute", left: 0, top: 0, zIndex: 2 }}>
            {
                props.model && props.model.scene.children.length ?
                    <Tree
                        checkable
                        // defaultExpandedKeys={['0-0-0', '0-0-1']}
                        // defaultSelectedKeys={['0-0-0', '0-0-1']}
                        // defaultCheckedKeys={['0-0-0', '0-0-1']}
                        onSelect={onSelect}
                        // defaultExpandAll={true}
                        onCheck={onCheck}
                        treeData={props.model.scene.children}>

                    </Tree>
                    :
                    <p>{'loading tree'}</p>

            }

        </div>


}

export default TreeDiv