import React,{
    View, Text, Component, Animated,
    TouchableNativeFeedback
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

class TreeView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            collapsed: {}
        }
    }

    _toggleState(type, i, node) {
        const {collapsed} = this.state
        const {onItemClicked} = this.props

        collapsed[type + i] = !collapsed[type + i]
        this.setState({
            collapsed: collapsed
        })
        if (onItemClicked)
            onItemClicked(type, i, node)
    }

    _getStyle(type, tag) {
        return [styles[tag], styles[type + tag]]
    }

    _getNodeView(type, i, node) {
        const {collapsed} = this.state
        const iconSize = type == 'root' ? 16 : 14
        const hasChildren = !!node.data
        const icon = node.icon ? node.icon : (collapsed[type + i] ? 'chevron-right' : 'keyboard-arrow-down')
        return (
            <View style={this._getStyle(type, 'item')}>
                {
                    !hasChildren && !node.icon  ? null : <Icon style={this._getStyle(type, 'icon')} size={iconSize} name={icon} />
                }
                <Text style={this._getStyle(type, 'text')}> {node.text} </Text>
            </View>
        )
    }

    _getNode(type, i, node) {
        const {collapsed} = this.state
        const {renderItem} = this.props
        const hasChildren = !!node.data

        return (
            <View key={i} style={this._getStyle(type, 'node')} >
                <TouchableNativeFeedback
                    onPress={() => this._toggleState.bind(this)(type, i, node)}
                    background={TouchableNativeFeedback.SelectableBackground()} >
                    {renderItem ? renderItem(type, i, node) : this._getNodeView(type, i, node)}
                </TouchableNativeFeedback>
                <View style={styles.children}>
                    {
                        collapsed[type + i] ? null : this.getTree('children', node.data || [])
                    }
                </View>
            </View>
        )
    }

    getTree(type, data) {
        const nodes = [];
        for (const i = 0; i < data.length; i++) {
            nodes.push(this._getNode(type, i, data[i]))
        }
        return nodes
    }

    render() {
        const {data} = this.props
        return (
            <View style={styles.tree}>
                {this.getTree('root', data)}
            </View>
        )
    }
}

const styles = {
    tree: {
        padding: 10
    },
    rootnode: {
        paddingBottom: 10,
    },
    node: {
        paddingTop: 10
    },
    item: {
        flexDirection: 'row',
    },
    children: {
        paddingLeft: 20
    },
    icon: {
        paddingRight: 10,
        color: '#333',
        alignSelf: 'center'
    },
    roottext: {
        fontSize: 18
    }
}

export default TreeView
