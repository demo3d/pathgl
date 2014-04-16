function triangulate(curves) {
  triangulator.Perp(0, 0, 1)
  var t = []
  triangulator.StartShape(t)
  for (var i = 0; i < curves.length; i++) {
    triangulator.StartCurve()
    var curve = curves[i]
    for (var j = 0; j < curve.length; j += 2) {
      var xys = [curve[j], curve[j+1], 0]
      triangulator.point(xys, xys)
    }
    triangulator.EndCurve()
  }
  triangulator.EndShape()
  return t
}

var failure_T = 'Could not Triangulate'
var debugT = function (cond) { debug(cond, 'Could not Tangulate...') }
T.sweepDebugEvent = function(mala) {}
T.MAX_XY = 1e150
T.MALA_MAX_STORE = 100
T.DEFAULT_EPSILON = 0
T.S__X_ = 1
T.S__Y_ = 0
T.SIGN_INCONSISTENT_ = 2
T.cond = { T_SLEEP: 0
         , T_IN_SHAPE: 1
         , T_IN_CURVE: 2
         }

T.command = { COMM_ODD: 100130
            , COMM_NONZERO: 100131
            , COMM_POSITIVE: 100132
            , COMM_NEGATIVE: 100133
            , COMM_ABS_GEQ_TWO: 10013
            }

var primitive = { LINE_LOOP: 2
                , MALAANGLES: 4
                , MALAANGLE_SMALAP: 5
                , MALAANGLE_FAN: 6
                }

T.failureType = {
  MISSING_START_SHAPE: 100151,
  MISSING_END_SHAPE: 100153,
  MISSING_START_CURVE: 100152,
  MISSING_END_CURVE: 100154,
  XY_TOO_BIG: 100155,
  NEED_COMBINE_BACK: 100156
}

T.opt =  { SURFACE: 100112
         , EPSILON: 100142
         , COMM_RULE: 100140
         , LINE_ONLY: 100141
         , INVALID_: 100900
         , INVALID_VALUE: 100901
         , START: 100100
         , POINT: 100101
         , END: 100102
         , FAILURE: 100103
         , LINE_FLAG: 100104
         , COMBINE: 100105
         , START_STAT: 100106
         , POINT_STAT: 100107
         , END_STAT: 100108
         , FAILURE_STAT: 100109
         , LINE_FLAG_STAT: 100110
         , COMBINE_STAT: 100111
         }

T.storepoint = function() {
  this.xys = [0, 0, 0]
}

function T() {
  this.state = T.cond.T_SLEEP
  this.perp = [0, 0, 0]
  this.s = [0, 0, 0]
  this.t = [0, 0, 0]

  this.relEpsilon = T._EPSILON
  this.command = T.command.COMM_ODD
  this.storeCount = 0
  this.store = new Array(T.MALA_MAX_STORE)

  for (var i = 0; i < T.MALA_MAX_STORE;  i++)
    this.store[i] = new T.storepoint()
}

T.prototype.Perp = function(x, y, z) {
  this.perp[0] = x
  this.perp[1] = y
  this.perp[2] = z
}

T.prototype.on = function (w, fn) {
  fn = fn || null

  if (T.opt.START)  this.Start_ = (fn)
  if (w == T.opt.START_STAT)  this.StartStat_ =(fn)
  if (w == T.opt.LINE_FLAG) this.flagLine = (!!fn)
  if (w == T.opt.LINE_FLAG_STAT) this.flagLine = (!!fn)
  if (w == T.opt.POINT)  this.point_ = (fn)
  if (w == T.opt.POINT_STAT)  this.pointStat_ = (fn)
  if (w == T.opt.END)  this.End_ = (fn)
  if (w == T.opt.END_STAT)  this.EndStat_ = (fn)
  if (w == T.opt.FAILURE)  this.Failure_ = (fn)
  if (w == T.opt.FAILURE_STAT)  this.FailureStat_ = (fn)
  if (w == T.opt.COMBINE)  this.Combine_ = (fn)
  if (w == T.opt.COMBINE_STAT)  this.CombineStat_ = (fn)
  if (w == T.opt.SURFACE)  this.Surface_ = (fn)

  return this
}

T.prototype.point = function(xys, stat) {
  var tooBig = false
  var clamped = [0, 0, 0]

  this.requireState_(T.cond.T_IN_CURVE)

  if (this.emptyStore) {
    this.emptyStore_()
    this.lastLine_ = null
  }

  for (var i = 0; i < 3; ++i) {
    var x = xys[i]
    if (x < -T.MAX_XY) {
      x = -T.MAX_XY
      tooBig = true
    }
    if (x > T.MAX_XY) {
      x = T.MAX_XY
      tooBig = true
    }
    clamped[i] = x
  }

  if (tooBig) this.FailureOrFailureStat(T.failureType.XY_TOO_BIG)

  if (this.surface === null) {
    if (this.storeCount < T.MALA_MAX_STORE) return this.storepoint_(clamped, stat)
    this.emptyStore_()
  }

  this.addpoint_(clamped, stat)
}

T.prototype.StartShape = function(stat) {
  this.requireState_(T.cond.T_SLEEP)

  this.state = T.cond.T_IN_SHAPE
  this.storeCount = 0
  this.emptyStore = false
  this.surface = null

  this.shapeStat_ = stat
}

T.prototype.StartCurve = function() {
  this.requireState_(T.cond.T_IN_SHAPE)
  this.state = T.cond.T_IN_CURVE
  this.lastLine_ = null
  if (this.storeCount > 0) this.emptyStore = true
}

T.prototype.EndCurve = function() {
  this.requireState_(T.cond.T_IN_CURVE)
  this.state = T.cond.T_IN_SHAPE
}

T.prototype.EndShape = function() {
  this.requireState_(T.cond.T_IN_SHAPE)
  this.state = T.cond.T_SLEEP

  if (this.surface === null) {
    if (!this.flagLine && !this.Surface_ && T.drawStore(this)) return this.shapeStat_ = null
    this.emptyStore_()
  }
  T.projectShape(this)
  T.computeInner(this)

  if (!this.fatalFailure) {
    this.lineOnly ?
      T.FollowId(this.surface, 1, true) :
      T.patchInner(this.surface)

    this.surface.fixSurface()

    if (this.Start_ || this.End_ || this.point_ ||
        this.LineFlag_ || this.StartStat_ || this.EndStat_ ||
        this.pointStat_ || this.LineFlagStat_) {

      this.lineOnly ?
        T.drawLine(this, this.surface) :
        T.drawSurface(this, this.surface)
    }

    if (this.Surface_) {
      T.discardOuter(this.surface)
      this.Surface_(this.surface)
      this.surface = null
      return this.shapeStat_ = null
    }
  }

  T.surface.killSurface(this.surface)
  this.shapeStat_ = null
  this.surface = null
}

T.prototype.makeSleep_ = function() {
  if (this.surface) T.surface.killSurface(this.surface)
  this.state = T.cond.T_SLEEP
  this.lastLine_ = null
  this.surface = null
}

T.prototype.requireState_ = function(state) {
  if (this.state !== state) this.gotoState_(state)
}

T.prototype.gotoState_ = function(newState) {
  while (this.state !== newState) {
    if (this.state < newState) {
      switch (this.state) {
        case T.cond.T_SLEEP:
          this.FailureOrFailureStat(T.failureType.MISSING_START_SHAPE)
          return this.StartShape(null)
        case T.cond.T_IN_SHAPE:
          this.FailureOrFailureStat(T.failureType.MISSING_START_CURVE)
          return this.StartCurve()
      }
    } else {
      switch (this.state) {
        case T.cond.T_IN_CURVE:
          this.FailureOrFailureStat(T.failureType.MISSING_END_CURVE)
          return this.EndCurve()
        case T.cond.T_IN_SHAPE:
          this.FailureOrFailureStat(T.failureType.MISSING_END_SHAPE)
          return this.makeSleep_()
      }
    }
  }
}

T.prototype.addpoint_ = function(xys, stat) {
  var e = this.lastLine_
  if (e === null) {
    e = T.surface.makeLine(this.surface)
    T.surface.surfaceSplit(e, e.sym)
  } else {
    T.surface.splitLine(e)
    e = e.lThere
  }

  e.org.stat = stat
  e.org.xys[0] = xys[0]
  e.org.xys[1] = xys[1]
  e.org.xys[2] = xys[2]
  e.follow = 1
  e.sym.follow = -1
  this.lastLine_ = e
}

T.prototype.storepoint_ = function(xys, stat) {
  var v = this.store[this.storeCount]
  v.stat = stat
  v.xys[0] = xys[0]
  v.xys[1] = xys[1]
  v.xys[2] = xys[2]
  ++this.storeCount
}

T.prototype.emptyStore_ = function() {
  this.surface = new T.Surface()
  for (var i = 0; i < this.storeCount; i++) {
    var v = this.store[i]
    this.addpoint_(v.xys, v.stat)
  }
  this.storeCount = 0
  this.emptyStore = false
}

T.prototype.StartOrStartStat = function(type) {
  this.StartStat_ ?
    this.StartStat_(type, this.shapeStat_) :
    this.Start_ && this.Start_(type)
}

T.prototype.pointOrpointStat = function(stat) {
  this.pointStat_ ?
    this.pointStat_(stat, this.shapeStat_) :
    this.point_ && this.point_(stat)
}

T.prototype.LineFlagOrLineFlagStat = function(flag) {
  this.LineFlagStat_ ?
    this.LineFlagStat_(flag, this.shapeStat_) :
    this.LineFlag_ && this.LineFlag_(flag)
}

T.prototype.EndOrEndStat = function() {
  this.EndStat_ ?
    this.EndStat_(this.shapeStat_) :
    this.End_ && this.End_()
}

T.prototype.CombineOrCombineStat = function(xys, stat, depth) {
  var interpStat = this.CombineStat_ ?
    this.CombineStat_(xys, stat, depth, this.shapeStat_) :
    this.Combine_(xys, stat, depth)
  return interpStat === undefined ?  interpStat = null :  interpStat
}

T.prototype.FailureOrFailureStat = function(errno) {
  this.FailureStat_ ?
    this.FailureStat_(errno, this.shapeStat_) :
    this.Failure_ && this.Failure_(errno)
}

T.DictN = function() {
    this.key = null
    this.there = null
    this.prev = null
}

T.DictN.prototype.Key = function() {
  return this.key
}

T.DictN.prototype.Succ = function() {
  return this.there
}

T.DictN.prototype.Pred = function() {
  return this.prev
}

T.Dict = function(frame, leq) {
  this.start = new T.DictN()
  this.start.there = this.start
  this.start.prev = this.start
  this.frame = frame
  this.leq_ = (leq)
}

T.Dict.prototype.addBefore = function(n, key) {
  do {
    n = n.prev
  } while(n.key !== null && !this.leq_(this.frame, n.key, key))

  var newN = new T.DictN()
  newN.key = key
  newN.there = n.there
  n.there.prev = newN
  newN.prev = n
  n.there = newN
  return newN
}

T.Dict.prototype.add = function(key) {
  return this.addBefore(this.start, key)
}

T.Dict.prototype.killN = function(n) {
  n.there.prev = n.prev
  n.prev.there = n.there
}

T.Dict.prototype.search = function(key) {
  var n = this.start
  do {
    n = n.there
  } while(n.key !== null && !this.leq_(this.frame, key, n.key))
  return n
}


T.Dict.prototype.Min = function() {
  return this.start.there
}

T.Dict.prototype.Max = function() {
  return this.start.prev
}


T.PQN = function() {
    this.handle = 0
}

T.PQN.renew = function(oldArray, size) {
  var newArray = new Array(size)
  var index = 0

  if (oldArray !== null)
    for (;index < oldArray.length; index++) newArray[index] = oldArray[index]

  for (;index < size; index++) newArray[index] = new T.PQN()

  return newArray
}


T.PQHandleElem = function() {
    this.key = null
    this.n = 0
}

T.PQHandleElem.renew = function(oldArray, size) {
  var newArray = new Array(size)
  var index = 0
  if (oldArray !== null)
    for (;index < oldArray.length; index++) newArray[index] = oldArray[index]

  for (;index < size; index++) newArray[index] = new T.PQHandleElem()

  return newArray
}

T.Heap = function(leq) {
  this.ns_ = T.PQN.renew(null, T.Heap.INIT_SIZE_ + 1)
  this.handles_ = T.PQHandleElem.renew(null, T.Heap.INIT_SIZE_ + 1)
  this.size_ = 0
  this.max_ = T.Heap.INIT_SIZE_
  this.fList_ = 0
  this.initialized_ = false
  this.leq_ = leq
  this.ns_[1].handle = 1
}

T.Heap.INIT_SIZE_ = 32
T.Heap.prototype.killHeap = function() {
  this.handles_ = null
  this.ns_ = null
}

T.Heap.prototype.init = function() {
  for(var i = this.size_; i >= 1; --i)
    this.floatDown_(i)

  this.initialized_ = true
}

T.Heap.prototype.add = function(keyNew) {
  var now = ++this.size_, f

  if ((now*2) > this.max_) {
    this.max_ *= 2
    this.ns_ = T.PQN.renew(this.ns_, this.max_ + 1)
    this.handles_ = T.PQHandleElem.renew(this.handles_, this.max_ + 1)
  }

  if (this.fList_ === 0) f = now
  else {
    f = this.fList_
    this.fList_ = this.handles_[f].n
  }

  this.ns_[now].handle = f
  this.handles_[f].n = now
  this.handles_[f].key = keyNew

  if (this.initialized_) this.floatUp_(now)
  return f
}

T.Heap.prototype.isEmpty = function() {
  return this.size_ === 0
}

T.Heap.prototype.minimum = function() {
  return this.handles_[this.ns_[1].handle].key
}

T.Heap.prototype.extractMin = function() {
  var n = this.ns_
  var h = this.handles_
  var hMin = n[1].handle
  var min = h[hMin].key

  if (this.size_ > 0) {
    n[1].handle = n[this.size_].handle
    h[n[1].handle].n = 1

    h[hMin].key = null
    h[hMin].n = this.fList_
    this.fList_ = hMin

    if (--this.size_ > 0 ) this.floatDown_(1)
  }

  return min
}

T.Heap.prototype.remove = function(hNow) {
  var n = this.ns_
  var h = this.handles_

  debugT(hNow >= 1 && hNow <= this.max_ && h[hNow].key !== null)

  var now = h[hNow].n
  n[now].handle = n[this.size_].handle
  h[n[now].handle].n = now

  if (now <= --this.size_) {
    (now <= 1 || this.leq_(h[n[now>>1].handle].key, h[n[now].handle].key)) ?
      this.floatDown_(now) :
      this.floatUp_(now)
  }

  h[hNow].key = null
  h[hNow].n = this.fList_
  this.fList_ = hNow
}

T.Heap.prototype.floatDown_ = function(now) {
  var n = this.ns_
  var h = this.handles_
  var hNow = n[now].handle
  for( ;; ) {
    var child = now << 1
    if (child < this.size_ && this.leq_(h[n[child+1].handle].key, h[n[child].handle].key)) ++child

    debugT(child <= this.max_)

    var hChild = n[child].handle
    if (child > this.size_ || this.leq_(h[hNow].key, h[hChild].key)) {
      n[now].handle = hNow
      return h[hNow].n = now
    }
    n[now].handle = hChild
    h[hChild].n = now
    now = child
  }
}

T.Heap.prototype.floatUp_ = function(now) {
  var n = this.ns_
  var h = this.handles_

  var hNow = n[now].handle
  for( ;; ) {
    var parent = now >> 1
    var hParent = n[parent].handle
    if (parent === 0 || this.leq_(h[hParent].key, h[hNow].key)) {
      n[now].handle = hNow
      return h[hNow].n = now
    }

    n[now].handle = hParent
    h[hParent].n = now
    now = parent
  }
}


T.PriorityQ = function(leq) {
  this.keys_ = T.PriorityQ.prototype.PQKeyRenew_(null, T.PriorityQ.INIT_SIZE_)
  this.order_ = null
  this.size_ = 0
  this.max_ = T.PriorityQ.INIT_SIZE_
  this.initialized_ = false

  this.leq_ = (leq)

  this.heap_ = new T.Heap(this.leq_)
}

T.PriorityQ.INIT_SIZE_ = 32

T.PriorityQ.prototype.init = function() {
  this.order_ = []
  for (var i = 0; i < this.size_; i++) this.order_[i] = i
  var comparator = (function(keys, leq) {
    return function(a, b) {
      return leq(keys[a], keys[b]) ? 1 : -1
    }
  })(this.keys_, this.leq_)
  this.order_.sort(comparator)

  this.max_ = this.size_
  this.initialized_ = true
  this.heap_.init()

  var p = 0
  var r = p + this.size_ - 1
  for (i = p; i < r; ++i)
    debugT(this.leq_(this.keys_[this.order_[i+1]], this.keys_[this.order_[i]]))
}

T.PriorityQ.prototype.add = function(keyNew) {
  if (this.initialized_) return this.heap_.add(keyNew)

  var now = this.size_
  if (++this.size_ >= this.max_) {
    this.max_ *= 2
    this.keys_ = T.PriorityQ.prototype.PQKeyRenew_(this.keys_, this.max_)
  }

  this.keys_[now] = keyNew
  return -(now+1)
}

T.PriorityQ.prototype.PQKeyRenew_ = function(oldArray, size) {
  var newArray = new Array(size)
  var index = 0
  if (oldArray !== null)
    for (; index < oldArray.length; index++)
      newArray[index] = oldArray[index]

  for (; index < size; index++) newArray[index] = null

  return newArray
}

T.PriorityQ.prototype.keyLessThan_ = function(x, y) {
  var keyX = this.keys_[x]
  var keyY = this.keys_[y]
  return !this.leq_(keyY, keyX)
}

T.PriorityQ.prototype.keyGreaterThan_ = function(x, y) {
  var keyX = this.keys_[x]
  var keyY = this.keys_[y]
  return !this.leq_(keyX, keyY)
}

T.PriorityQ.prototype.extractMin = function() {
  if (this.size_ === 0) return this.heap_.extractMin()

  var sortMin = this.keys_[this.order_[this.size_-1]]
  if (!this.heap_.isEmpty()) {
    var heapMin = this.heap_.minimum()
    if (this.leq_(heapMin, sortMin)) return this.heap_.extractMin()
  }

  do {
    --this.size_
  } while(this.size_ > 0 && this.keys_[this.order_[this.size_-1]] === null)

  return sortMin
}

T.PriorityQ.prototype.minimum = function() {
  if (this.size_ === 0) return this.heap_.minimum()

  var sortMin = this.keys_[this.order_[this.size_-1]]
  if (!this.heap_.isEmpty()) {
    var heapMin = this.heap_.minimum()
    if (this.leq_(heapMin, sortMin)) return heapMin
  }
  return sortMin
}

T.PriorityQ.prototype.isEmpty = function() {
  return (this.size_ === 0) && this.heap_.isEmpty()
}

T.PriorityQ.prototype.remove = function(now) {
  if (now >= 0) return this.heap_.remove(now)

  now = -(now+1)

  debugT(now < this.max_ && this.keys_[now] !== null)

  this.keys_[now] = null
  while(this.size_ > 0 && this.keys_[this.order_[this.size_-1]] === null)
    --this.size_
}

T.fixOrientation_ = function(mala) {
  var area = 0
  var fStart = mala.surface.fStart
  for (var f = fStart.there; f !== fStart; f = f.there) {
    var e = f.anLine
    if (e.follow <= 0) { continue }
    do {
      area += (e.org.s - e.dst().s) * (e.org.t + e.dst().t)
      e = e.lThere
    } while(e !== f.anLine)
  }

  if (area < 0) {
    var vStart = mala.surface.vStart
    for (var v = vStart.there; v !== vStart; v = v.there) v.t = - v.t
    mala.t[0] = -mala.t[0]
    mala.t[1] = -mala.t[1]
    mala.t[2] = -mala.t[2]
  }
}

T.patchSpace_ = function(face) {
  var up = face.anLine
  if (! (up.lThere !== up && up.lThere.lThere !== up)) log(failure_T)

  while(T.pointLeq(up.dst(), up.org)) up = up.lPrev()
  while(T.pointLeq(up.org, up.dst())) up = up.lThere

  var lo = up.lPrev()
    , tempHalfLine
  while (up.lThere !== lo) {
    if (T.pointLeq(up.dst(), lo.org)) {
      while (lo.lThere !== up && (T.lineGoesLeft(lo.lThere) ||
          T.lineSign(lo.org, lo.dst(), lo.lThere.dst()) <= 0)) {

        tempHalfLine = T.surface.connect(lo.lThere, lo)
        lo = tempHalfLine.sym
      }
      lo = lo.lPrev()

    } else {
      while (lo.lThere !== up && (T.lineGoesRight(up.lPrev()) ||
          T.lineSign(up.dst(), up.org, up.lPrev().org) >= 0)) {

        tempHalfLine = T.surface.connect(up, up.lPrev())
        up = tempHalfLine.sym
      }
      up = up.lThere
    }
  }
  if (! (lo.lThere !== up)) log(failure_T)
  while (lo.lThere.lThere !== up) {
    tempHalfLine = T.surface.connect(lo.lThere, lo)
    lo = tempHalfLine.sym
  }
}

T.surface = function() {}

T.surface.makeLine = function(surface) {
  var e = T.surface.makeLinePair_(surface.eStart)
  T.surface.makepoint_(e, surface.vStart)
  T.surface.makepoint_(e.sym, surface.vStart )
  T.surface.makeFace_(e, surface.fStart)

  return e
}

T.surface.surfaceSplit = function(eOrg, eDst) {
  var joiningLoops = false
  var joiningPoints = false

  if (eOrg === eDst) return

  if (eDst.org !== eOrg.org) {
    joiningPoints = true
    T.surface.killpoint_(eDst.org, eOrg.org)
  }

  if (eDst.lFace !== eOrg.lFace) {
    joiningLoops = true
    T.surface.killFace_(eDst.lFace, eOrg.lFace)
  }

  T.surface.split_(eDst, eOrg)

  if (!joiningPoints) {
    T.surface.makepoint_(eDst, eOrg.org)
    eOrg.org.anLine = eOrg
  }

  if (!joiningLoops) {
    T.surface.makeFace_(eDst, eOrg.lFace)
    eOrg.lFace.anLine = eOrg
  }
}


T.surface.killLine = function(eDel) {
  var eDelSym = eDel.sym
  var joiningLoops = false

  if (eDel.lFace !== eDel.rFace()) {
    joiningLoops = true
    T.surface.killFace_(eDel.lFace, eDel.rFace())
  }

  if (eDel.oThere === eDel) T.surface.killpoint_(eDel.org, null)
  else {
    eDel.rFace().anLine = eDel.oPrev()
    eDel.org.anLine = eDel.oThere

    T.surface.split_(eDel, eDel.oPrev())

    if (!joiningLoops) T.surface.makeFace_(eDel, eDel.lFace)
  }

  if (eDelSym.oThere === eDelSym ) {
    T.surface.killpoint_(eDelSym.org, null)
    T.surface.killFace_(eDelSym.lFace, null)
  } else {
    eDel.lFace.anLine = eDelSym.oPrev()
    eDelSym.org.anLine = eDelSym.oThere
    T.surface.split_(eDelSym, eDelSym.oPrev())
  }

  T.surface.killLine_(eDel)
}

T.surface.addLinepoint = function(eOrg) {
  var eNew = T.surface.makeLinePair_(eOrg)
  var eNewSym = eNew.sym

  T.surface.split_(eNew, eOrg.lThere)
  eNew.org = eOrg.dst()
  T.surface.makepoint_(eNewSym, eNew.org )

  eNew.lFace = eNewSym.lFace = eOrg.lFace

  return eNew
}

T.surface.splitLine = function(eOrg) {
  var tempHalfLine = T.surface.addLinepoint(eOrg)
  var eNew = tempHalfLine.sym

  T.surface.split_(eOrg.sym, eOrg.sym.oPrev())
  T.surface.split_(eOrg.sym, eNew)

  eOrg.sym.org = eNew.org
  eNew.dst().anLine = eNew.sym
  eNew.sym.lFace = eOrg.rFace()
  eNew.follow = eOrg.follow
  eNew.sym.follow = eOrg.sym.follow

  return eNew
}

T.surface.connect = function(eOrg, eDst) {
  var joiningLoops = false
  var eNew = T.surface.makeLinePair_(eOrg)
  var eNewSym = eNew.sym

  if (eDst.lFace !== eOrg.lFace) {
    joiningLoops = true
    T.surface.killFace_(eDst.lFace, eOrg.lFace)
  }

  T.surface.split_(eNew, eOrg.lThere)
  T.surface.split_(eNewSym, eDst)

  eNew.org = eOrg.dst()
  eNewSym.org = eDst.org
  eNew.lFace = eNewSym.lFace = eOrg.lFace


  eOrg.lFace.anLine = eNewSym

  if (!joiningLoops) T.surface.makeFace_(eNew, eOrg.lFace )
  return eNew
}

T.surface.zapFace = function(fZap) {
  var eStart = fZap.anLine
    , eThere = eStart.lThere
    , e

  do {
    e = eThere
    eThere = e.lThere
    e.lFace = null

    if (e.rFace() === null) {
      if (e.oThere === e) T.surface.killpoint_(e.org, null)
      else {
        e.org.anLine = e.oThere
        T.surface.split_(e, e.oPrev())
      }

      var eSym = e.sym
      if (eSym.oThere === eSym) T.surface.killpoint_(eSym.org, null)
      else {
        eSym.org.anLine = eSym.oThere
        T.surface.split_(eSym, eSym.oPrev())
      }
      T.surface.killLine_(e)
    }
  } while(e !== eStart)

  var fPrev = fZap.prev
  var fThere = fZap.there
  fThere.prev = fPrev
  fPrev.there = fThere
}

T.surface.surfaceUnion = function(surface1, surface2) {
  var f1 = surface1.fStart
  var v1 = surface1.vStart
  var e1 = surface1.eStart

  var f2 = surface2.fStart
  var v2 = surface2.vStart
  var e2 = surface2.eStart

  if (f2.there !== f2) {
    f1.prev.there = f2.there
    f2.there.prev = f1.prev
    f2.prev.there = f1
    f1.prev = f2.prev
  }

  if (v2.there !== v2) {
    v1.prev.there = v2.there
    v2.there.prev = v1.prev
    v2.prev.there = v1
    v1.prev = v2.prev
  }

  if (e2.there !== e2) {
    e1.sym.there.sym.there = e2.there
    e2.there.sym.there = e1.sym.there
    e2.sym.there.sym.there = e1
    e1.sym.there = e2.sym.there
  }

  return surface1
}

T.surface.killSurface = function(surface) {}


T.surface.makeLinePair_ = function(eThere) {
  var e = new T.HalfLine()
  var eSym = new T.HalfLine()
  var ePrev = eThere.sym.there
  eSym.there = ePrev
  ePrev.sym.there = e
  e.there = eThere
  eThere.sym.there = eSym

  e.sym = eSym
  e.oThere = e
  e.lThere = eSym

  eSym.sym = e
  eSym.oThere = eSym
  eSym.lThere = e

  return e
}

T.surface.split_ = function(a, b) {
  var aOThere = a.oThere
  var bOThere = b.oThere
  aOThere.sym.lThere = b
  bOThere.sym.lThere = a
  a.oThere = bOThere
  b.oThere = aOThere
}

T.surface.makepoint_ = function(eOrig, vThere) {
  var vPrev = vThere.prev
  var vNew = new T.point(vThere, vPrev)
  vPrev.there = vNew
  vThere.prev = vNew
  vNew.anLine = eOrig
  var e = eOrig

  do {
    e.org = vNew
    e = e.oThere
  } while(e !== eOrig)
}

T.surface.makeFace_ = function(eOrig, fThere) {
  var fPrev = fThere.prev
  var fNew = new T.Face(fThere, fPrev)


  fPrev.there = fNew
  fThere.prev = fNew
  fNew.anLine = eOrig
  fNew.inside = fThere.inside

  var e = eOrig
  do {
    e.lFace = fNew
    e = e.lThere
  } while(e !== eOrig)
}

T.surface.killLine_ = function(eDel) {
  var eThere = eDel.there
  var ePrev = eDel.sym.there
  eThere.sym.there = ePrev
  ePrev.sym.there = eThere
}

T.surface.killpoint_ = function(vDel, newOrg) {
  var eStart = vDel.anLine
  var e = eStart
  do {
    e.org = newOrg
    e = e.oThere
  } while(e !== eStart)

  var vPrev = vDel.prev
  var vThere = vDel.there
  vThere.prev = vPrev
  vPrev.there = vThere
}

T.surface.killFace_ = function(fDel, newLFace) {
  var eStart = fDel.anLine
  var e = eStart
  do {
    e.lFace = newLFace
    e = e.lThere
  } while(e !== eStart)

  var fPrev = fDel.prev
  var fThere = fDel.there
  fThere.prev = fPrev
  fPrev.there = fThere
}


T.Face = function(opt_thereFace, opt_prevFace) {
    this.there = opt_thereFace || this
    this.prev = opt_prevFace || this
    this.anLine = null
    this.stat = null
    this.trail = null
    this.marked = false
    this.inside = false
}

T.HalfLine = function(opt_thereLine) {
    this.there = opt_thereLine || this
    this.sym = null
    this.oThere = null
    this.lThere = null
    this.org = null
    this.lFace = null
    this.region = null
    this.follow = 0
}

T.HalfLine.prototype.rFace = function() {
  return this.sym.lFace
}

T.HalfLine.prototype.dst = function() {
  return this.sym.org
}

T.HalfLine.prototype.oPrev = function() {
  return this.sym.lThere
}

T.HalfLine.prototype.lPrev = function() {
  return this.oThere.sym
}

T.HalfLine.prototype.dPrev = function() {
  return this.lThere.sym
}

T.HalfLine.prototype.rPrev = function() {
  return this.sym.oThere
}

T.HalfLine.prototype.dThere = function() {
  return this.rPrev().sym
}

T.HalfLine.prototype.rThere = function() {
  return this.oPrev().sym
}

T.point = function(opt_therepoint, opt_prevpoint) {
    this.there = opt_therepoint || this
    this.prev = opt_prevpoint || this
    this.anLine = null
    this.stat = null
    this.xys = [0, 0, 0]
    this.s = 0
    this.t = 0
    this.pqHandle = null
}

T.Surface = function() {
  this.vStart = new T.point()
  this.fStart = new T.Face()
  this.eStart = new T.HalfLine()
  this.eStartSym = new T.HalfLine()
  this.eStart.sym = this.eStartSym
  this.eStartSym.sym = this.eStart
}

T.Surface.prototype.fixSurface = function() {
  var fStart = this.fStart
  var vStart = this.vStart
  var eStart = this.eStart
  var e
  var f
  var fPrev = fStart

  for (fPrev = fStart; (f = fPrev.there) !== fStart; fPrev = f) {
    debugT(f.prev === fPrev)
    e = f.anLine
    do {
      debugT(e.sym !== e)
      debugT(e.sym.sym === e)
      debugT(e.lThere.oThere.sym === e)
      debugT(e.oThere.sym.lThere === e)
      debugT(e.lFace === f)
      e = e.lThere
    } while(e !== f.anLine)
  }
  debugT(f.prev === fPrev && f.anLine === null && f.stat === null)

  var v
  var vPrev = vStart
  for (vPrev = vStart; (v = vPrev.there) !== vStart; vPrev = v) {
    debugT(v.prev === vPrev)
    e = v.anLine
    do {
      debugT(e.sym !== e)
      debugT(e.sym.sym === e)
      debugT(e.lThere.oThere.sym === e)
      debugT(e.oThere.sym.lThere === e)
      debugT(e.org === v)
      e = e.oThere
    } while(e !== v.anLine)
  }
  debugT(v.prev === vPrev && v.anLine === null && v.stat === null)

  var ePrev = eStart
  for (ePrev = eStart; (e = ePrev.there) !== eStart; ePrev = e) {
    debugT(e.sym.there === ePrev.sym)
    debugT(e.sym !== e)
    debugT(e.sym.sym === e)
    debugT(e.org !== null)
    debugT(e.dst() !== null)
    debugT(e.lThere.oThere.sym === e)
    debugT(e.oThere.sym.lThere === e)
  }
  debugT(e.sym.there === ePrev.sym &&
         e.sym === this.eStartSym &&
         e.sym.sym === e &&
         e.org === null && e.dst() === null &&
         e.lFace === null && e.rFace() === null)
}

T.SENTINEL_XY_ = 4 * T.MAX_XY
T.EPSILON_NONZERO_ = false

T.computeInner = function(mala) {
  mala.fatalFailure = false
  T.removeDeadLines_(mala)
  T.initPriorityQ_(mala)
  T.initLineDict_(mala)
  var v
  while ((v = mala.pq.extractMin()) !== null) {
    for ( ;; ) {
      var vThere = (mala.pq.minimum())
      if (vThere === null || !T.pointEq(vThere, v)) break

      vThere = (mala.pq.extractMin())
      T.splitMergePoints_(mala, v.anLine, vThere.anLine)
    }
    T.sweepEvent_(mala, v)
  }
  var swapReg = (mala.dict.Min().Key())
  mala.event = swapReg.eUp.org
  T.sweepDebugEvent(mala)
  T.doneLineDict_(mala)
  T.done(mala)

  T.removeDeadFaces_(mala.surface)
  mala.surface.fixSurface()
}


T.addFollow_ = function(eDst, eSrc) {
  eDst.follow += eSrc.follow
  eDst.sym.follow += eSrc.sym.follow
}

T.lineLeq_ = function(mala, reg1, reg2) {
  var event = mala.event
  var e1 = reg1.eUp
  var e2 = reg2.eUp

  if (e1.dst() === event) {
    if (e2.dst() === event) {
      if (T.pointLeq(e1.org, e2.org)) return T.lineSign(e2.dst(), e1.org, e2.org) <= 0
      return T.lineSign(e1.dst(), e2.org, e1.org) >= 0
    }

    return T.lineSign(e2.dst(), event, e2.org) <= 0
  }

  if (e2.dst() === event) return T.lineSign(e1.dst(), event, e1.org) >= 0

  var t1 = T.lineEval(e1.dst(), event, e1.org)
  var t2 = T.lineEval(e2.dst(), event, e2.org)
  return (t1 >= t2)
}

T.killSpace_ = function(mala, reg) {
  if (reg.fixUpperLine) debugT(reg.eUp.follow === 0)

  reg.eUp.region = null

  mala.dict.killN(reg.nUp)
  reg.nUp = null
}

T.fixUpperLine_ = function(reg, newLine) {
  debugT(reg.fixUpperLine)
  T.surface.killLine(reg.eUp)

  reg.fixUpperLine = false
  reg.eUp = newLine
  newLine.region = reg
}



T.topLeftSpace_ = function(reg) {
  var org = reg.eUp.org
  do {
    reg = reg.spaceAbove()
  } while (reg.eUp.org === org)

  if (reg.fixUpperLine) {
    var e = T.surface.connect(reg.spaceBelow().eUp.sym, reg.eUp.lThere)
    T.fixUpperLine_(reg, e)
    reg = reg.spaceAbove()
  }

  return reg
}

T.topRightSpace_ = function(reg) {
  var dst = reg.eUp.dst()

  do {
    reg = reg.spaceAbove()
  } while (reg.eUp.dst() === dst)

  return reg
}

T.addSpaceBelow_ = function(mala, regAbove, eNewUp) {
  var regNew = new T.Region()

  regNew.eUp = eNewUp
  regNew.nUp = mala.dict.addBefore(regAbove.nUp, regNew)
  eNewUp.region = regNew

  return regNew
}

T.isFollowInside_ = function(mala, n) {
  switch(mala.command) {
    case T.command.COMM_ODD: return ((n & 1) !== 0)
    case T.command.COMM_NONZERO: return (n !== 0)
    case T.command.COMM_POSITIVE: return (n > 0)
    case T.command.COMM_NEGATIVE: return (n < 0)
    case T.command.COMM_ABS_GEQ_TWO: return (n >= 2) || (n <= -2)
  }

  debugT(false)
  return false
}

T.computeFollow_ = function(mala, reg) {
  reg.followId = reg.spaceAbove().followId + reg.eUp.follow
  reg.inside = T.isFollowInside_(mala, reg.followId)
}

T.finishSpace_ = function(mala, reg) {
  var e = reg.eUp
  var f = e.lFace

  f.inside = reg.inside
  f.anLine = e
  T.killSpace_(mala, reg)
}

T.finishLeftSpaces_ = function(mala, regFirst, regLast) {
  var regPrev = regFirst
  var ePrev = regFirst.eUp
  while (regPrev !== regLast) {
    regPrev.fixUpperLine = false
    var reg = regPrev.spaceBelow()
    var e = reg.eUp
    if (e.org !== ePrev.org) {
      if (!reg.fixUpperLine) {
        T.finishSpace_(mala, regPrev)
        break
      }

      e = T.surface.connect(ePrev.lPrev(), e.sym)
      T.fixUpperLine_(reg, e)
    }

    if (ePrev.oThere !== e) {
      T.surface.surfaceSplit(e.oPrev(), e)
      T.surface.surfaceSplit(ePrev, e)
    }

    T.finishSpace_(mala, regPrev)
    ePrev = reg.eUp
    regPrev = reg
  }

  return ePrev
}

T.addRightLines_ = function(mala, regUp, eFirst, eLast, eTopLeft, cleanUp) {
  var firstTime = true
  var e = eFirst
  do {
    debugT(T.pointLeq(e.org, e.dst()))
    T.addSpaceBelow_(mala, regUp, e.sym)
    e = e.oThere
  } while (e !== eLast)
  if (eTopLeft === null) eTopLeft = regUp.spaceBelow().eUp.rPrev()
  var regPrev = regUp
  var ePrev = eTopLeft
  var reg
  for( ;; ) {
    reg = regPrev.spaceBelow()
    e = reg.eUp.sym
    if (e.org !== ePrev.org) break

    if (e.oThere !== ePrev) {
      T.surface.surfaceSplit(e.oPrev(), e)
      T.surface.surfaceSplit(ePrev.oPrev(), e)
    }
    reg.followId = regPrev.followId - e.follow
    reg.inside = T.isFollowInside_(mala, reg.followId)
    regPrev.dirty = true
    if (!firstTime && T.fixForRightSplit_(mala, regPrev)) {
      T.addFollow_(e, ePrev)
      T.killSpace_(mala, regPrev)
      T.surface.killLine(ePrev)
    }
    firstTime = false
    regPrev = reg
    ePrev = e
  }

  regPrev.dirty = true
  debugT(regPrev.followId - e.follow === reg.followId)

  if (cleanUp) T.walkDirtySpaces_(mala, regPrev)
}

T.Combine_ = function(mala, isect, stat, depths, needed) {
  var xys = [
    isect.xys[0],
    isect.xys[1],
    isect.xys[2]
  ]

  isect.stat = null
  isect.stat = mala.CombineOrCombineStat(xys, stat, depths)
  if (isect.stat === null) {
    if (!needed) {
      isect.stat = stat[0]
    } else if (!mala.fatalFailure) {
      mala.FailureOrFailureStat(T.failureType.NEED_COMBINE_BACK)
      mala.fatalFailure = true
    }
  }
}

T.patchInner = function(surface) {
  for (var f = surface.fStart.there, there = f.there; f !== surface.fStart; there = (f = there).there)
    if (f.inside) T.patchSpace_(f)
}

T.discardOuter = function(surface) {
  for (var f = surface.fStart.there, there = f.there; f !== surface.fStart; there = (f = there).there)
    if (!f.inside) T.surface.zapFace(f)
}

T.FollowId = function(surface, value, keepOnlyLine) {
  for (var eThere, e = surface.eStart.there; e !== surface.eStart; e = eThere, eThere = e.there)
    if (e.rFace().inside !== e.lFace.inside) e.follow = (e.lFace.inside) ? value : -value
    else keepOnlyLine ? T.surface.killLine(e) : e.follow = 0
}

var triangulator = new T()
                   .on(T.opt.POINT_STAT, function (d, poly) { poly.push(d[0], d[1]) })
                   .on(T.opt.COMBINE, function (d) { return d.slice(0, 2) })
                   .on(T.opt.LINE_FLAG, noop)
