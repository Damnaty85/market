// import React, { useContext } from 'react';
// import { useRouter } from 'next/router';
// import { Store } from '../utils/Store';

// export default function Shipping() {
//     const router = useRouter();
//     const { state } = useContext(Store);
//     const { userInfo } = state;
//     if (!userInfo) {
//         router.push('/login?redirect=/shipping');
//     }

//     return <div>Shipping page</div>;
// }

import React from 'react'

export default function Shipping() {
  return (
    <div>Shipping</div>
  )
}
