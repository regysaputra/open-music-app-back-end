// const mapDBToModel = ({ 
//     id,
//     title,
//     year,
//     performer,
//     genre,
//     duration,
//     inserted_at,
//     updated_at
// }) => ({
//     id,
//     title,
//     year,
//     performer,
//     genre,
//     duration,
//     insertedAt: inserted_at,
//     updatedAt: updated_at
// });

const mapDBToModel = ({ inserted_at, updated_at, ...args }) => ({
    ...args,
    insertedAt: inserted_at,
    updatedAt: updated_at,
});

module.exports = { mapDBToModel };