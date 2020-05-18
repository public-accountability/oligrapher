import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector, makeCancelable } from '../util/helpers'
import { lock } from '../datasources/littlesis3'

const POLL_INTERVAL = 10 * 1000
const FAILURE_LIMIT = 10

export default function LockPoll() {
  const dispatch = useDispatch()
  const mapId = useSelector(state => state.attributes.id)
  const [status, setStatus] = useState('READY')
  const [failCount, setFailCount] = useState(0)

  useEffect(() => {
    if (mapId && status === 'READY') {
      setStatus('POLLING')
      // console.log('Polling for lock...')

      const httpRequest = makeCancelable(lock(mapId))

      httpRequest
        .promise
        .then(json => {
          setStatus('WAITING')
          dispatch({ type: 'SET_LOCK', lock: json })
          setTimeout(() => setStatus('READY'), POLL_INTERVAL)
        })
        .catch((err) => {
          if (!err.isCanceled) {
            setFailCount(failCount + 1)
            setStatus('WAITING')
            if (failCount > FAILURE_LIMIT) {
              console.error(`Poll HTTP request failed too many times`)
              setStatus('FAILED')
            } else {
              setTimeout(() => setStatus('READY'), POLL_INTERVAL)
            }
          }
        })

      return httpRequest.cancel
    }
  }, [mapId, status, dispatch, failCount])

  return null
}
