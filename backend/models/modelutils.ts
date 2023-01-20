import mongoose from "mongoose"

type ID = mongoose.Types.ObjectId

/**
 * @brief type for populated models
 * @param M the base type
 * @param K the attribute of the base type M that is populated (can be multiple with attr1 | attr2)
 */
type Populated<M, K extends keyof M> = 
    Omit<M, K> &
    {
        [P in K]: Exclude<M[P], ID[] | ID>
    }


/**
 * @brief type for selected models
 * @param M the base type
 * @param K the attribute(s) that are selected by the query, can be multiple with attr1 | attr2)
 */
type Select<M, K extends keyof M> = 
    Pick<M, K> & Document


export { ID, Populated, Select }