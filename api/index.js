import express from 'express';

import data from '../src/testData';

const router = express.Router();
const contests = data.contests.reduce((obj, contest) => {
    obj[contest.id] = contest;
    return obj;
}, {});

router.get('/contests', (req, res) => {
    res.send({ contests });
});

router.get('/contests/:contestId', (req, res) => {
    let contest = contests[req.params.contestId];
    contest.description = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis voluptas quidem, esse quas, et nulla sapiente eaque libero possimus reprehenderit similique. Laudantium similique illo aspernatur veniam esse quas sequi repellat nemo, mollitia dolorum iste inventore placeat praesentium quasi enim nobis atque odio dolor velit explicabo, rerum cum asperiores maxime. Modi doloribus quaerat saepe! Quisquam placeat nesciunt, sapiente doloribus fugiat fugit, iure, accusantium quo cumque officia quod. Provident autem, impedit quaerat nulla, molestiae dignissimos repellat eum laborum commodi dolorem delectus, ab, voluptate esse illum doloremque. Excepturi cumque voluptatem illum aliquid sunt. Reprehenderit odio, distinctio. Alias, magni sunt optio. Qui dignissimos, provident!';
    res.send(contest);
});

export default router;