// portfolio_slice.ts
import { msg } from "@lit/localize"
import { createSlice } from "@reduxjs/toolkit"
import { createRequestMiddleware } from "../../middleware/fetch"


import { 
  PortfolioInfo, 
  PortfolioItemInfo, 
  MinimalDisplayedPortfolioItemInfo, 
  MinimalPortfolioItemInfo, 
  BlocklyProgSequenceItemInfo,
  BlocklyProgramItemInfo,
  TextItemInfo,
  SocialRobotDesignItemInfo,
  PortfolioFilter
} from '../../../../../../shared/types/portfolio'


const portfolioList: PortfolioInfo[] = []

const initialPortfolioState = {
    selectedPortfolio: null,
    portfolioList: []
}

export const portfolioSlice = createSlice({
    name: "portfolio",
    initialState: initialPortfolioState,
    reducers: {
        setPortfolioList: (state, action) => {
            state.portfolioList = action.payload
        },
        setSelectedPortfolio: (state, action) => {
            state.selectedPortfolio = action.payload
        },
        setSelectedPortfolioItems: (state, action) => {
            if (state.selectedPortfolio){
                // Map children to items in the portfolio.
                action.payload.children = action.payload.children.map(childItem => {
                    return action.payload.find(item => item.uuid === childItem.uuid)
                })
                (state.selectedPortfolio as PortfolioInfo).items = action.payload
            }
        },
        updateSelectedPortfolioItem: (state, action) => {
            if (state.selectedPortfolio){
                let updatedItem = action.payload
                let index = (state.selectedPortfolio as PortfolioInfo).items.findIndex(item => item.uuid === updatedItem.uuid)
                if (index >= 0){
                    (state.selectedPortfolio as PortfolioInfo).items[index] = updatedItem
                } else {
                    (state.selectedPortfolio as PortfolioInfo).items.push(updatedItem)
                }
            }
        },
        addNewPortfolioItem: (state, action) => {
            if (state.selectedPortfolio){
                (state.selectedPortfolio as PortfolioInfo).items.push(action.payload)
            }
        },
        attachChildItemToParent: (state, action) => {
            const { parentUUID, childUUID } = action.payload
            if (state.selectedPortfolio){
                let portfolio = state.selectedPortfolio as PortfolioInfo
                let parent = portfolio.items.find(item => item.uuid === parentUUID)
                let child = portfolio.items.find(item => item.uuid === childUUID)
                if (parent && child){
                    parent.children.push(child)
                }
            }
        },
    }
})

const removeCircularDependenciesFromPortfolioItem = (item: MinimalPortfolioItemInfo) => {
    // To prevent circular references in the item, remove the child references of children of this item
    item.children = item.children.map(child => {
        const { children, ...rest } = child
        return { ...rest, children: [] }
    })
    // Remove the item itself from the children of the item
    item.children = item.children.filter(child => child !== item)
    return item
}

const deletePortfolioItem = (portfolioUuid: string, itemUuid: string) => {
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/${portfolioUuid}/deleteItem/${itemUuid}`, "DELETE", (dispatch, getState, json) => {
        dispatch(getPortfolio(portfolioUuid))
    }, null, msg("Error while deleting portfolio item"))
}

const createPortfolioItem = (portfolioUuid: string, item: MinimalPortfolioItemInfo, parentItem?: MinimalPortfolioItemInfo) => {
    item = removeCircularDependenciesFromPortfolioItem(item)
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/${portfolioUuid}/createItem`, "PUT", (dispatch, getState, json) => {
        console.log(json)
        dispatch(addNewPortfolioItem(json))
        if (parentItem){
            parentItem.children.push(json)
            dispatch(savePortfolioItem(portfolioUuid, parentItem))
        }
    }, item, msg("Error while creating portfolio item"))
}

const savePortfolioItem = (portfolioUuid: string, item: MinimalPortfolioItemInfo) => {
    // Map children in items to new objects to avoid circular references
    item = removeCircularDependenciesFromPortfolioItem(item)
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/${portfolioUuid}/saveItem`, "PUT", (dispatch, getState, json) => {
        console.log(json)
        dispatch(updateSelectedPortfolioItem(json))
    }, item, msg("Error while saving portfolio item"))
}

const getPortfolios = (filter: PortfolioFilter) => {
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/filter`, "POST", (dispatch, getState, json) => {
        console.log(json)
        dispatch(setPortfolioList(json))
    }, filter, msg("Error while fetching portfolios"))
}

const getMyPortfolios = () => {
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/mine`, "GET", (dispatch, getState, json) => {
        console.log(json)
        dispatch(setPortfolioList(json))
    }, null, msg("Error while fetching portfolios"))
}

const getMyStudentPortfolios = () => {
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/sharedWithMe`, "GET", (dispatch, getState, json) => {
        console.log(json)
        dispatch(setPortfolioList(json))
    }, null, msg("Error while fetching portfolios"))
}

const getPortfolio = (uuid: string) => {
    return createRequestMiddleware(`${globalSettings.hostname}/portfolio/${uuid}`, "GET", (dispatch, getState, json) => {
        console.log(json)
        dispatch(setSelectedPortfolio(json))
    }, null, msg("Error while fetching portfolio"))
}


const connectPortfolioItemsInCurrentPortfolio = (parentUUID: string, childUUID: string) => {
    return async (dispatch, getState) => {
        let portfolio = getState().portfolio.selectedPortfolio
        if (portfolio){
            let parent = portfolio.items.find(item => item.uuid === parentUUID)
            let child = portfolio.items.find(item => item.uuid === childUUID)
            if (parent && child){
                let updateParent = {...parent, children: [...parent.children, child]} 
                await dispatch(savePortfolioItem(portfolio.uuid, updateParent))
            }
        }
    }
}


const { setPortfolioList, setSelectedPortfolio, setSelectedPortfolioItems, updateSelectedPortfolioItem, addNewPortfolioItem, attachChildItemToParent } = portfolioSlice.actions

const portfolioReducer = portfolioSlice.reducer

export { 
    getPortfolios, 
    getMyPortfolios, 
    getPortfolio, 
    PortfolioItemInfo, 
    MinimalDisplayedPortfolioItemInfo,
    MinimalPortfolioItemInfo, 
    portfolioReducer, 
    PortfolioInfo, 
    TextItemInfo, 
    setSelectedPortfolioItems, 
    savePortfolioItem, 
    createPortfolioItem, 
    deletePortfolioItem, 
    BlocklyProgSequenceItemInfo, 
    BlocklyProgramItemInfo,
    SocialRobotDesignItemInfo, 
    getMyStudentPortfolios,
    connectPortfolioItemsInCurrentPortfolio}