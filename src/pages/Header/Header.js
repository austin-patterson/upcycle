import getAllAgentRelationships from "../../queries/AgentRelationship/getAllAgentRelationships";
import getMyAgent from "../../queries/Agent/getMyAgent";
import getOrganizationById from "../../queries/Organization/getOrganizationById";
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import * as currentOrgActions from '../../redux/actions/currentOrgActions';
import * as currentUserActions from '../../redux/actions/currentUserActions';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as defaultImage from "../../resources/defaultImage.jpg";
import * as logo from '../../resources/upcycleLogo.png'
import React, {Component} from "react";
import {Image, Menu, Input, Dropdown, Loader} from "semantic-ui-react";
import styles from './Header.css';
import 'semantic-ui-css/semantic.min.css'

let myAgentId = -1;
let currentOrganizationId = -1;
let setCurrentOrganizationId;
const menuDropDown = [
    {key: 'home', text: 'Home', as: Link, to: '/'},
    {key: 'projects', text: 'Projects', as: Link, to: '/'},
    {key: 'activities', text: 'Activities', as: Link, to: '/'},
    {key: 'profile', text: 'Profile', as: Link, to: '/'},
    {key: 'notifications', text: 'Notifications', as: Link, to: '/'},
    ];

let OrgNameByID = getOrganizationById(({organization, loading, error}) => {
    if (loading) {
        return <Loader active inline='centered'/>;
    } else if (error) {
        return (<p style={{color: "#F00"}}>API error</p>);

    } else {
        if (currentOrganizationId === organization.id) {
            return (
                <div className={styles.blueify}>
                    <Image src={organization.image ? organization.image : defaultImage} avatar/>
                    <span>{organization.name}</span>
                </div>
            );
        }
        else {
            return (<Dropdown.Item onClick={() => {
                    setCurrentOrganizationId(organization.id);
                }} text={organization.name} value={organization.id} className={styles.blueify}/>
            );
        }
    }
});


let AgentRelationships = getAllAgentRelationships(({agentRelationshipList, loading, error}) => {
    if (loading) {

        return (
            <Menu.Item fitted="vertically">
                <Dropdown width={250} loading text={"Loading"} id={"orgDropdown"} className={styles.blueify}/>
            </Menu.Item>
        );
    } else if (error) {
        return (
            <Menu.Item fitted="vertically">
                <Dropdown width={250} loading text={"Error"} id={"orgDropdown"} className={styles.blueify}/>;
            </Menu.Item>
        );

    } else {
        let filteredRelationships = [];
        let counter = 0;
        for (let relationship of agentRelationshipList) {
            if (relationship.subject.id === myAgentId && relationship.object.id !== currentOrganizationId) {
                filteredRelationships[counter] = relationship;
                counter++;
            }
        }

        let orgList = filteredRelationships.map(relationship => (
            <OrgNameByID organizationId={relationship.object.id}/>
        ));
        if (filteredRelationships.length === 0) {

            // ownedOrgIDsArray = <p> No current orgs</p>;
            //Empty
        }
        return (
            <div className={styles.blueify}>
                <Menu.Item fitted="vertically" >
                    <Dropdown selection width={250} options={orgList} className={styles.blueify}
                              text={currentOrganizationId !== -1 ?<OrgNameByID organizationId={currentOrganizationId} /> :
                                  <div className={styles.blueify}>
                                  <Image src={defaultImage} avatar/>
                                  <span>{"Select an organization ▼"}</span>
                                  </div>
                                  } id={"orgDropdown"}
                              icon={null}/>
                </Menu.Item>

            </div>)
    }
});


let MyAgent = getMyAgent(({agent, loading, error}) => {
    let errorOrLoadingPart;
    if (loading) {
        errorOrLoadingPart = <Loader active inline='centered'/>;

    } else if (error) {
        errorOrLoadingPart = <p style={{color: "#F00"}}>API error</p>;
    } else {
        myAgentId = agent.id;
        return (
            <Menu.Menu position="right" className={styles.blueify}>
                <Menu.Item fitted="vertically">
                    <AgentRelationships/>
                    <Image src={agent.image ? agent.image : "https://via.placeholder.com/200.png?text=Logo%20Preview"}
                           avatar/>
                    <span id={"username"}>{agent.name}</span>
                </Menu.Item>
                <Menu.Item  className={styles.text}>
                    <Dropdown floating options={menuDropDown} text='More ▼' icon={null}/>
                </Menu.Item>
            </Menu.Menu>
        );
    }
    return (
        <Menu.Menu position="right" className={styles.blueify}>
            <Menu.Item>
                {errorOrLoadingPart}
            </Menu.Item>
            <Menu.Item  className={styles.text}>
                <Dropdown floating options={menuDropDown} text='°°°' icon={null}/>
            </Menu.Item>
        </Menu.Menu>
    );
});

class NavMenu extends Component {

    state = {
        currentUserActions: undefined
    };

    constructor(props) {
        super(props);
        this.state = ({currentUserActions: this.props.currentUserActions});
    }

    logout = () => {
        this.state.currentUserActions.setCurrentUserToken("N/A");
    };

    render() {
        return(
            <Menu fixed="top" className={styles.blueify}>
                <Menu.Item fitted="vertically">
                    <Image size="mini" src={logo} href={'/'}/>
                </Menu.Item>
                <Menu.Item fitted="vertically">
                    <Input className='icon' icon='search' placeholder='Searching is disabled' disabled/>
                </Menu.Item>
                <MyAgent/>
                <Menu.Item onClick={this.logout} className={styles.text}>
                    Log Out
                </Menu.Item>
            </Menu>
        );
    }

}


class NavBar extends Component {

    render() {
        currentOrganizationId = this.props.currentOrganizationId;
        setCurrentOrganizationId = this.props.currentOrgActions.setCurrentId;
        return (
            <div style={{height: 50, marginBottom:10}}>
                <NavMenu currentUserActions={this.props.currentUserActions}/>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        currentOrganizationId: state.getUserInfo.currentOrgId,
        currentUserToken: state.getUserInfo.currentUserToken,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        currentOrgActions: bindActionCreators(currentOrgActions, dispatch),
        currentUserActions: bindActionCreators(currentUserActions, dispatch)
    };
}


export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar));
