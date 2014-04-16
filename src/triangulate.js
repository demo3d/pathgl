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

var debugT = function (cond) { debug(cond, 'Could not Triangulate...') }
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
  debugT(up.lThere !== up && up.lThere.lThere !== up)

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
  debugT(lo.lThere !== up)
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


T.splitMergePoints_ = function(mala, e1, e2) {
  var stat = [null, null, null, null]
  var depths = [0.5, 0.5, 0, 0]

  stat[0] = e1.org.stat
  stat[1] = e2.org.stat
  T.Combine_(mala, e1.org, stat, depths, false)
  T.surface.surfaceSplit(e1, e2)
}

T.pointDepths_ = function(isect, org, dst, depths, depthIndex) {
  var t1 = T.pointL1dist(org, isect)
  var t2 = T.pointL1dist(dst, isect)
  var i0 = depthIndex
  var i1 = depthIndex + 1
  depths[i0] = 0.5 * t2 / (t1 + t2)
  depths[i1] = 0.5 * t1 / (t1 + t2)
  isect.xys[0] += depths[i0]*org.xys[0] + depths[i1]*dst.xys[0]
  isect.xys[1] += depths[i0]*org.xys[1] + depths[i1]*dst.xys[1]
  isect.xys[2] += depths[i0]*org.xys[2] + depths[i1]*dst.xys[2]
}

T.IntersectStat_ = function(mala, isect, orgUp, dstUp, orgLo, dstLo) {
  var depths = [0, 0, 0, 0]
  var stat = [
    orgUp.stat,
    dstUp.stat,
    orgLo.stat,
    dstLo.stat
  ]
  isect.xys[0] = isect.xys[1] = isect.xys[2] = 0
  T.pointDepths_(isect, orgUp, dstUp, depths, 0)
  T.pointDepths_(isect, orgLo, dstLo, depths, 2)
  T.Combine_(mala, isect, stat, depths, true)
}

T.fixForRightSplit_ = function(mala, regUp) {
  var regLo = regUp.spaceBelow()
  var eUp = regUp.eUp
  var eLo = regLo.eUp

  if (T.pointLeq(eUp.org, eLo.org)) {
    if (T.lineSign(eLo.dst(), eUp.org, eLo.org) > 0) return false

    if (!T.pointEq(eUp.org, eLo.org)) {
      T.surface.splitLine(eLo.sym)
      T.surface.surfaceSplit(eUp, eLo.oPrev())
      regUp.dirty = regLo.dirty = true

    } else if (eUp.org !== eLo.org) {
      mala.pq.remove((eUp.org.pqHandle))
      T.splitMergePoints_(mala, eLo.oPrev(), eUp)
    }

  } else {
    if (T.lineSign(eUp.dst(), eLo.org, eUp.org) < 0) return false

    regUp.spaceAbove().dirty = regUp.dirty = true
    T.surface.splitLine(eUp.sym)
    T.surface.surfaceSplit(eLo.oPrev(), eUp)
  }

  return true
}

T.fixForLeftSplit_ = function(mala, regUp) {
  var regLo = regUp.spaceBelow()
  var eUp = regUp.eUp
  var eLo = regLo.eUp
  var e

  debugT(!T.pointEq(eUp.dst(), eLo.dst()))

  if (T.pointLeq(eUp.dst(), eLo.dst())) {
    if (T.lineSign(eUp.dst(), eLo.dst(), eUp.org) < 0) return false

    regUp.spaceAbove().dirty = regUp.dirty = true
    e = T.surface.splitLine(eUp)
    T.surface.surfaceSplit(eLo.sym, e)
    e.lFace.inside = regUp.inside
  } else {
    if (T.lineSign(eLo.dst(), eUp.dst(), eLo.org) > 0) return false

    regUp.dirty = regLo.dirty = true
    e = T.surface.splitLine(eLo)
    T.surface.surfaceSplit(eUp.lThere, eLo.sym)
    e.rFace().inside = regUp.inside
  }

  return true
}

T.fixForIntersect_ = function(mala, regUp) {
  var regLo = regUp.spaceBelow()
  var eUp = regUp.eUp
  var eLo = regLo.eUp
  var orgUp = eUp.org
  var orgLo = eLo.org
  var dstUp = eUp.dst()
  var dstLo = eLo.dst()

  var isect = new T.point()

  debugT(!T.pointEq(dstLo, dstUp))
  debugT(T.lineSign(dstUp, mala.event, orgUp) <= 0)
  debugT(T.lineSign(dstLo, mala.event, orgLo) >= 0 )
  debugT(orgUp !== mala.event && orgLo !== mala.event)
  debugT(!regUp.fixUpperLine && !regLo.fixUpperLine)

  if (orgUp === orgLo) return false

  var tMinUp = Math.min(orgUp.t, dstUp.t)
  var tMaxLo = Math.max(orgLo.t, dstLo.t)
  if (tMinUp > tMaxLo) return false

  if (T.pointLeq(orgUp, orgLo)) {
    if (T.lineSign(dstLo, orgUp, orgLo) > 0) return false
  } else {
    if (T.lineSign(dstUp, orgLo, orgUp) < 0) return false
  }

  T.sweepDebugEvent(mala)

  T.lineIntersect(dstUp, orgUp, dstLo, orgLo, isect)


  debugT(Math.min(orgUp.t, dstUp.t) <= isect.t)
  debugT(isect.t <= Math.max(orgLo.t, dstLo.t))
  debugT(Math.min(dstLo.s, dstUp.s) <= isect.s)
  debugT(isect.s <= Math.max(orgLo.s, orgUp.s))

  if (T.pointLeq(isect, mala.event)) {
    isect.s = mala.event.s
    isect.t = mala.event.t
  }


  var orgMin = T.pointLeq(orgUp, orgLo) ? orgUp : orgLo
  if (T.pointLeq(orgMin, isect)) {
    isect.s = orgMin.s
    isect.t = orgMin.t
  }

  if (T.pointEq(isect, orgUp) || T.pointEq(isect, orgLo)) {
    T.fixForRightSplit_(mala, regUp)
    return false
  }

  if ((!T.pointEq(dstUp, mala.event) && T.lineSign(dstUp, mala.event, isect) >= 0) ||
      (!T.pointEq(dstLo, mala.event) && T.lineSign(dstLo, mala.event, isect) <= 0)) {
    if (dstLo === mala.event) {
      T.surface.splitLine(eUp.sym)
      T.surface.surfaceSplit(eLo.sym, eUp)
      regUp = T.topLeftSpace_(regUp)
      eUp = regUp.spaceBelow().eUp
      T.finishLeftSpaces_(mala, regUp.spaceBelow(), regLo)
      T.addRightLines_(mala, regUp, eUp.oPrev(), eUp, eUp, true)
      return true
    }

    if (dstUp === mala.event) {
      T.surface.splitLine(eLo.sym)
      T.surface.surfaceSplit(eUp.lThere, eLo.oPrev())
      regLo = regUp
      regUp = T.topRightSpace_(regUp)
      var e = regUp.spaceBelow().eUp.rPrev()
      regLo.eUp = eLo.oPrev()
      eLo = T.finishLeftSpaces_(mala, regLo, null)
      T.addRightLines_(mala, regUp, eLo.oThere, eUp.rPrev(), e, true)
      return true
    }

    if (T.lineSign(dstUp, mala.event, isect) >= 0) {
      regUp.spaceAbove().dirty = regUp.dirty = true
      T.surface.splitLine(eUp.sym)
      eUp.org.s = mala.event.s
      eUp.org.t = mala.event.t
    }

    if (T.lineSign(dstLo, mala.event, isect) <= 0) {
      regUp.dirty = regLo.dirty = true
      T.surface.splitLine(eLo.sym)
      eLo.org.s = mala.event.s
      eLo.org.t = mala.event.t
    }
    return false
  }

  T.surface.splitLine(eUp.sym)
  T.surface.splitLine(eLo.sym)
  T.surface.surfaceSplit(eLo.oPrev(), eUp)
  eUp.org.s = isect.s
  eUp.org.t = isect.t
  eUp.org.pqHandle = mala.pq.add(eUp.org)
  T.IntersectStat_(mala, eUp.org, orgUp, dstUp, orgLo, dstLo)
  regUp.spaceAbove().dirty = regUp.dirty = regLo.dirty = true

  return false
}

T.walkDirtySpaces_ = function(mala, regUp) {
  var regLo = regUp.spaceBelow()

  for ( ;; ) {
    while (regLo.dirty) {
      regUp = regLo
      regLo = regLo.spaceBelow()
    }
    if (!regUp.dirty) {
      regLo = regUp
      regUp = regUp.spaceAbove()
      if (regUp === null || !regUp.dirty) return
    }

    regUp.dirty = false
    var eUp = regUp.eUp
    var eLo = regLo.eUp

    if (eUp.dst() !== eLo.dst()) {
      if (T.fixForLeftSplit_(mala, regUp)) {
        if (regLo.fixUpperLine) {
          T.killSpace_(mala, regLo)
          T.surface.killLine(eLo)
          regLo = regUp.spaceBelow()
          eLo = regLo.eUp

        } else if (regUp.fixUpperLine) {
          T.killSpace_(mala, regUp)
          T.surface.killLine(eUp)
          regUp = regLo.spaceAbove()
          eUp = regUp.eUp
        }
      }
    }

    if (eUp.org !== eLo.org) {
      if (eUp.dst() !== eLo.dst() && !regUp.fixUpperLine && !regLo.fixUpperLine &&
          (eUp.dst() === mala.event || eLo.dst() === mala.event)) {
        if (T.fixForIntersect_(mala, regUp)) return
      } else T.fixForRightSplit_(mala, regUp)
    }

    if (eUp.org === eLo.org && eUp.dst() === eLo.dst()) {
      T.addFollow_(eLo, eUp)
      T.killSpace_(mala, regUp)
      T.surface.killLine(eUp)
      regUp = regLo.spaceAbove()
    }
  }
}

T.connecTghtpoint_ = function(mala, regUp, eBottomLeft) {
  var eTopLeft = eBottomLeft.oThere
    , regLo = regUp.spaceBelow()
    , eUp = regUp.eUp
    , eLo = regLo.eUp
    , dead = false

  if (eUp.dst() !== eLo.dst()) T.fixForIntersect_(mala, regUp)

  if (T.pointEq(eUp.org, mala.event)) {
    T.surface.surfaceSplit(eTopLeft.oPrev(), eUp)
    regUp = T.topLeftSpace_(regUp)
    eTopLeft = regUp.spaceBelow().eUp
    T.finishLeftSpaces_(mala, regUp.spaceBelow(), regLo)
    dead = true
  }

  if (T.pointEq(eLo.org, mala.event)) {
    T.surface.surfaceSplit(eBottomLeft, eLo.oPrev())
    eBottomLeft = T.finishLeftSpaces_(mala, regLo, null)
    dead = true
  }

  if (dead) {
    T.addRightLines_(mala, regUp, eBottomLeft.oThere, eTopLeft, eTopLeft, true)
    return
  }

  var eNew = (T.pointLeq(eLo.org, eUp.org))? eLo.oPrev() : eUp

  eNew = T.surface.connect(eBottomLeft.lPrev(), eNew)

  T.addRightLines_(mala, regUp, eNew, eNew.oThere, eNew.oThere, false)
  eNew.sym.region.fixUpperLine = true
  T.walkDirtySpaces_(mala, regUp)
}

T.connectLeftDead_ = function(mala, regUp, vEvent) {
  var e = regUp.eUp
  if (T.pointEq(e.org, vEvent)) {
    debugT(T.EPSILON_NONZERO_)
    return T.splitMergePoints_(mala, e, vEvent.anLine)
  }

  if (!T.pointEq(e.dst(), vEvent)) {
    T.surface.splitLine(e.sym)
    if (regUp.fixUpperLine) {
      T.surface.killLine(e.oThere)
      regUp.fixUpperLine = false
    }

    T.surface.surfaceSplit(vEvent.anLine, e)
    return T.sweepEvent_(mala, vEvent)
  }

  debugT(T.EPSILON_NONZERO_)
  regUp = T.topRightSpace_(regUp)
  var reg = regUp.spaceBelow()
    , eTopRight = reg.eUp.sym
    , eTopLeft = eTopRight.oThere
    , eLast = eTopLeft

  if (reg.fixUpperLine) {
    debugT(eTopLeft !== eTopRight)
    T.killSpace_(mala, reg)
    T.surface.killLine(eTopRight)
    eTopRight = eTopLeft.oPrev()
  }

  T.surface.surfaceSplit(vEvent.anLine, eTopRight)
  if (!T.lineGoesLeft(eTopLeft)) eTopLeft = null

  T.addRightLines_(mala, regUp, eTopRight.oThere, eLast, eTopLeft, true)
}

T.connectLeftpoint_ = function(mala, vEvent) {
  var swap = new T.Region()
  swap.eUp = vEvent.anLine.sym
  var regUp = (mala.dict.search(swap).Key())
    , regLo = regUp.spaceBelow()
    , eUp = regUp.eUp
    , eLo = regLo.eUp
      , eNew

  if (T.lineSign(eUp.dst(), vEvent, eUp.org) === 0)
    return T.connectLeftDead_(mala, regUp, vEvent)

  var reg = T.pointLeq(eLo.dst(), eUp.dst()) ? regUp : regLo

  if (regUp.inside || reg.fixUpperLine) {
    if (reg === regUp) eNew = T.surface.connect(vEvent.anLine.sym, eUp.lThere)
    else {
      var tempHalfLine = T.surface.connect(eLo.dThere(), vEvent.anLine)
      eNew = tempHalfLine.sym
    }

    reg.fixUpperLine ?
      T.fixUpperLine_(reg, eNew) :
      T.computeFollow_(mala, T.addSpaceBelow_(mala, regUp, eNew))

    T.sweepEvent_(mala, vEvent)
  } else
    T.addRightLines_(mala, regUp, vEvent.anLine, vEvent.anLine, null, true)

}

T.sweepEvent_ = function(mala, vEvent) {
  mala.event = vEvent
  T.sweepDebugEvent( mala )

  var e = vEvent.anLine

  while (e.region === null) {
    e = e.oThere
    if (e === vEvent.anLine) return T.connectLeftpoint_(mala, vEvent)
  }

  var regUp = T.topLeftSpace_(e.region)
    , reg = regUp.spaceBelow()
    , eTopLeft = reg.eUp
    , eBottomLeft = T.finishLeftSpaces_(mala, reg, null)

  eBottomLeft.oThere === eTopLeft ?
    T.connecTghtpoint_(mala, regUp, eBottomLeft) :
    T.addRightLines_(mala, regUp, eBottomLeft.oThere, eTopLeft, eTopLeft, true)
}

T.addSentinel_ = function(mala, t) {
  var reg = new T.Region()
  var e = T.surface.makeLine(mala.surface)
  e.org.s = T.SENTINEL_XY_
  e.org.t = t
  e.dst().s = -T.SENTINEL_XY_
  e.dst().t = t
  mala.event = e.dst()

  reg.eUp = e
  reg.followId = 0
  reg.inside = false
  reg.fixUpperLine = false
  reg.sentinel = true
  reg.dirty = false
  reg.nUp = mala.dict.add(reg)
}

T.initLineDict_ = function(mala) {
  mala.dict = new T.Dict(mala, (T.lineLeq_))
  T.addSentinel_(mala, -T.SENTINEL_XY_)
  T.addSentinel_(mala, T.SENTINEL_XY_)
}

T.doneLineDict_ = function(mala) {
  var fixedLines = 0
    , reg
  while ((reg = (mala.dict.Min().Key())) !== null) {
    if (!reg.sentinel) {
      debugT(reg.fixUpperLine)
      debugT(++fixedLines === 1)
    }
    debugT(reg.followId === 0)
    T.killSpace_(mala, reg)
  }

  mala.dict = null
}

T.removeDeadLines_ = function(mala) {
  var eStart = mala.surface.eStart

  var eThere
  for (var e = eStart.there; e !== eStart; e = eThere) {
    eThere = e.there
    var eLThere = e.lThere

    if (T.pointEq(e.org, e.dst()) && e.lThere.lThere !== e) {
      T.splitMergePoints_(mala, eLThere, e)
      T.surface.killLine(e)
      e = eLThere
      eLThere = e.lThere
    }

    if (eLThere.lThere === e) {
      if (eLThere !== e) {
        if (eLThere === eThere || eLThere === eThere.sym) eThere = eThere.there
        T.surface.killLine(eLThere)
      }

      if (e === eThere || e === eThere.sym ) eThere = eThere.there
      T.surface.killLine(e)
    }
  }
}

T.initPriorityQ_ = function(mala) {
  var pq = new T.PriorityQ((T.pointLeq))
  mala.pq = pq
  var vStart = mala.surface.vStart

  for (var v = vStart.there; v !== vStart; v = v.there) v.pqHandle = pq.add(v)
  pq.init()
}

T.done = function(mala) {
  mala.pq = null
}

T.removeDeadFaces_ = function(surface) {
  var fThere
  for (var f = surface.fStart.there; f !== surface.fStart; f = fThere) {
    fThere = f.there
    var e = f.anLine
    debugT(e.lThere !== e)
    if (e.lThere.lThere === e) {
      T.addFollow_(e.oThere, e)
      T.surface.killLine(e)
    }
  }
}

T.Region = function() {
    this.eUp = null
    this.nUp = null
    this.followId = 0
    this.inside = false
    this.sentinel = false
    this.dirty = false
    this.fixUpperLine = false
}

T.Region.prototype.spaceBelow = function() {
  return (this.nUp.Pred().Key())
}

T.Region.prototype.spaceAbove = function() {
  return (this.nUp.Succ().Key())
}

T.drawSurface = function(mala, surface) {
  mala.lonelyTList = null
  var f
  for(f = surface.fStart.there; f !== surface.fStart; f = f.there) {
    f.marked = false
  }
  for(f = surface.fStart.there; f !== surface.fStart; f = f.there) {
    if (f.inside && ! f.marked) {
      T.drawMaximumFaceGroup_(mala, f)
      debugT(f.marked)
    }
  }
  if (mala.lonelyTList !== null) {
    T.drawLonelyTangles_(mala, mala.lonelyTList)
    mala.lonelyTList = null
  }
}

T.drawLine = function(mala, surface) {
  for (var f = surface.fStart.there; f !== surface.fStart; f = f.there) {
    if (f.inside) {
      mala.StartOrStartStat(primitive.LINE_LOOP)
      var e = f.anLine
      do {
        mala.pointOrpointStat(e.org.stat)
        e = e.lThere
      } while (e !== f.anLine)

      mala.EndOrEndStat()
    }
  }
}

T.drawStore = function(mala) {
  if (mala.storeCount < 3) return true
  var norm = [0, 0, 0]
  norm[0] = mala.perp[0]
  norm[1] = mala.perp[1]
  norm[2] = mala.perp[2]

  if (norm[0] === 0 && norm[1] === 0 && norm[2] === 0)
    T.computePerp_(mala, norm, false)

  var sign = T.computePerp_(mala, norm, true)
  if (sign === T.SIGN_INCONSISTENT_) return false
  if (sign === 0) return true

  switch(mala.command) {
    case T.command.COMM_ODD:
    case T.command.COMM_NONZERO:
      break
    case T.command.COMM_POSITIVE:
      if (sign < 0) return true
      else break
    case T.command.COMM_NEGATIVE:
      if (sign > 0) return true
      else break
    case T.command.COMM_ABS_GEQ_TWO:
      return true
  }

  mala.StartOrStartStat(mala.lineOnly ?
      primitive.LINE_LOOP : (mala.storeCount > 3) ?
      primitive.MALAANGLE_FAN : primitive.TRIANGLES)

  var v0 = 0
  var vn = v0 + mala.storeCount
  var vc

  mala.pointOrpointStat(mala.store[v0].stat)
  if (sign > 0) {
    for (vc = v0+1; vc < vn; ++vc)
      mala.pointOrpointStat(mala.store[vc].stat)
  } else {
    for(vc = vn-1; vc > v0; --vc)
      mala.pointOrpointStat(mala.store[vc].stat)
  }
  mala.EndOrEndStat()
  return true
}

T.marked_ = function(f) {
  return (!f.inside || f.marked)
}

T.fTrail_ = function(t) {
  while (t !== null)
    t.marked = false, t = t.trail
}

T.maximumFan_ = function(eOrig) {
  var newFace = new T.FaceCount(0, null, T.drawFan_)
    , trail = null
    , e

  for(e = eOrig; !T.marked_(e.lFace); e = e.oThere) {
    e.lFace.trail = trail
    trail = e.lFace
    e.lFace.marked = true
    ++newFace.size
  }

  for(e = eOrig; !T.marked_(e.rFace()); e = e.oPrev()) {
    e.rFace().trail = trail
    trail = e.rFace()
    e.rFace().marked = true
    ++newFace.size
  }

  newFace.eStart = e
  T.fTrail_(trail)
  return newFace
}

T.maximumSTp_ = function(eOrig) {
  var newFace = new T.FaceCount(0, null, T.drawSTp_)
  var startSize = 0, tailSize = startSize
  var trail = null
  var e
  var eTail
  var eStart

  for (e = eOrig; !T.marked_(e.lFace); ++tailSize, e = e.oThere) {
    e.lFace.trail = trail
    trail = e.lFace
    e.lFace.marked = true

    ++tailSize
    e = e.dPrev()
    if (T.marked_(e.lFace)) {
      break
    }
    e.lFace.trail = trail
    trail = e.lFace
    e.lFace.marked = true
  }
  eTail = e

  for (e = eOrig; !T.marked_(e.rFace()); ++startSize, e = e.dThere()) {
    e.rFace().trail = trail
    trail = e.rFace()
    e.rFace().marked = true

    ++startSize
    e = e.oPrev()
    if (T.marked_(e.rFace())) {
      break
    }
    e.rFace().trail = trail
    trail = e.rFace()
    e.rFace().marked = true
  }
  eStart = e

  newFace.size = tailSize + startSize
  if ((tailSize & 1) === 0) {
    newFace.eStart = eTail.sym
  } else if ((startSize & 1) === 0) {
    newFace.eStart = eStart
  } else {
    --newFace.size
    newFace.eStart = eStart.oThere
  }

  T.fTrail_(trail)
  return newFace
}

T.drawFan_ = function(mala, e, size) {
  mala.StartOrStartStat(primitive.MALAANGLE_FAN)
  mala.pointOrpointStat(e.org.stat)
  mala.pointOrpointStat(e.dst().stat)

  while (!T.marked_(e.lFace)) {
    e.lFace.marked = true
    --size
    e = e.oThere
    mala.pointOrpointStat(e.dst().stat)
  }

  debugT(size === 0)
  mala.EndOrEndStat()
}

T.drawSTp_ = function(mala, e, size) {
  mala.StartOrStartStat(primitive.MALAANGLE_SMALAP)
  mala.pointOrpointStat(e.org.stat)
  mala.pointOrpointStat(e.dst().stat)

  while (!T.marked_(e.lFace)) {
    e.lFace.marked = true
    --size
    e = e.dPrev()
    mala.pointOrpointStat(e.org.stat)
    if (T.marked_(e.lFace)) break

    e.lFace.marked = true
    --size
    e = e.oThere
    mala.pointOrpointStat(e.dst().stat)
  }

  debugT(size === 0)
  mala.EndOrEndStat()
}

T.drawTangle_ = function(mala, e, size) {
  debugT(size === 1)

  e.lFace.trail = mala.lonelyTList
  mala.lonelyTList = e.lFace
  e.lFace.marked = true
}

T.drawMaximumFaceGroup_ = function(mala, fOrig) {
  var e = fOrig.anLine
    , max = new T.FaceCount(1, e, T.drawTangle_)
    , newFace

  if (!mala.flagLine) {
    newFace = T.maximumFan_(e)
    if (newFace.size > max.size) max = newFace

    newFace = T.maximumFan_(e.lThere)
    if (newFace.size > max.size) max = newFace

    newFace = T.maximumFan_(e.lPrev())
    if (newFace.size > max.size) max = newFace

    newFace = T.maximumSTp_(e)
    if (newFace.size > max.size) max = newFace

    newFace = T.maximumSTp_(e.lThere)
    if (newFace.size > max.size) max = newFace

    newFace = T.maximumSTp_(e.lPrev())
    if (newFace.size > max.size) max = newFace
  }

  max.draw(mala, max.eStart, max.size)
}

T.drawLonelyTangles_ = function(mala, start) {
  var lineState = -1
  var f = start
  mala.StartOrStartStat(primitive.TRIANGLES)
  for(; f !== null; f = f.trail) {
    var e = f.anLine
    do {
      if (mala.flagLine) {
        var newState = !e.rFace().inside ? 1 : 0
        if (lineState !== newState) {
          lineState = newState
          mala.LineFlagOrLineFlagStat(!!lineState)
        }
      }
      mala.pointOrpointStat(e.org.stat)

      e = e.lThere
    } while (e !== f.anLine)
  }

  mala.EndOrEndStat()
}

T.computePerp_ = function(mala, norm, fix) {
  if (!fix)
    norm[0] = norm[1] = norm[2] = 0
  var v0 = 0
  var vn = v0 + mala.storeCount
  var vc = v0 + 1
  var point0 = mala.store[v0]
  var pointc = mala.store[vc]

  var xc = pointc.xys[0] - point0.xys[0]
  var yc = pointc.xys[1] - point0.xys[1]
  var zc = pointc.xys[2] - point0.xys[2]

  var sign = 0
  while (++vc < vn) {
    pointc = mala.store[vc]
    var xp = xc
    var yp = yc
    var zp = zc
    xc = pointc.xys[0] - point0.xys[0]
    yc = pointc.xys[1] - point0.xys[1]
    zc = pointc.xys[2] - point0.xys[2]

    var n = [0, 0, 0]
    n[0] = yp*zc - zp*yc
    n[1] = zp*xc - xp*zc
    n[2] = xp*yc - yp*xc

    var dot = n[0]*norm[0] + n[1]*norm[1] + n[2]*norm[2]
    if (!fix) {
      if (dot >= 0) {
        norm[0] += n[0]
        norm[1] += n[1]
        norm[2] += n[2]
      } else {
        norm[0] -= n[0]
        norm[1] -= n[1]
        norm[2] -= n[2]
      }
    } else if (dot !== 0) {
      if (dot > 0) {
        if (sign < 0)
          return T.SIGN_INCONSISTENT_
        sign = 1
      } else {
        if (sign > 0)
          return T.SIGN_INCONSISTENT_
        sign = -1
      }
    }
  }

  return sign
}

T.FaceCount = function(size, eStart, drawFunction) {
  this.size = size
  this.eStart = eStart
  this.draw = drawFunction
}

T.pointEq = function(u, v) {
  return u.s === v.s && u.t === v.t
}

T.pointLeq = function(u, v) {
  return (u.s < v.s) || (u.s === v.s && u.t <= v.t)
}

T.lineEval = function(u, v, w) {
  debugT(T.pointLeq(u, v) && T.pointLeq(v, w))

  var gapL = v.s - u.s
    , gapR = w.s - v.s

  if (gapL + gapR > 0) return (gapL < gapR) ?
    (v.t - u.t) + (u.t - w.t) * (gapL / (gapL + gapR)) :
    (v.t - w.t) + (w.t - u.t) * (gapR / (gapL + gapR))

  return 0
}

T.lineSign = function(u, v, w) {
  debugT(T.pointLeq(u, v) && T.pointLeq(v, w))
  var gapL = v.s - u.s
    , gapR = w.s - v.s
  if (gapL + gapR > 0) return (v.t - w.t) * gapL + (v.t - u.t) * gapR

  return 0
}

T.Leq = function(u, v) {
  return (u.t < v.t) || (u.t === v.t && u.s <= v.s)
}

T.Eval = function(u, v, w) {
  debugT(T.Leq(u, v) && T.Leq(v, w))
  var gapL = v.t - u.t
    , gapR = w.t - v.t

  if (gapL + gapR > 0) return (gapL < gapR) ?
    (v.s - u.s) + (u.s - w.s) * (gapL / (gapL + gapR)) :
    (v.s - w.s) + (w.s - u.s) * (gapR / (gapL + gapR))

  return 0
}

T.Sign = function(u, v, w) {
  debugT(T.Leq(u, v) && T.Leq(v, w))

  var gapL = v.t - u.t
    , gapR = w.t - v.t

  return (gapL + gapR > 0) ? (v.s - w.s) * gapL + (v.s - u.s) * gapR : 0
}

T.lineGoesLeft = function(e) {
  return T.pointLeq(e.dst(), e.org)
}

T.lineGoesRight = function(e) {
  return T.pointLeq(e.org, e.dst())
}

T.pointL1dist = function(u, v) {
  return Math.abs(u.s - v.s) + Math.abs(u.t - v.t)
}

T.pointCCW = function(u, v, w) {
  return (u.s*(v.t - w.t) + v.s*(w.t - u.t) + w.s*(u.t - v.t)) >= 0
}

T.merge_ = function(a, x, b, y) {
  a = (a < 0) ? 0 : a
  b = (b < 0) ? 0 : b

  return a <= b ?
    b === 0 ? (x+y) / 2 :
    x + (y-x) * (a/(a+b)) :
    y + (x-y) * (b/(a+b))
}

T.lineIntersect = function(o1, d1, o2, d2, v) {
  var z1, z2
  var swap

  if (!T.pointLeq(o1, d1)) {
    swap = o1
    o1 = d1
    d1 = swap
  }

  if (!T.pointLeq(o2, d2)) {
    swap = o2
    o2 = d2
    d2 = swap
  }

  if (!T.pointLeq(o1, o2)) {
    swap = o1
    o1 = o2
    o2 = swap
    swap = d1
    d1 = d2
    d2 = swap
  }

  if (!T.pointLeq(o2, d1)) v.s = (o2.s + d1.s) / 2
  else if (T.pointLeq(d1, d2)) {
    z1 = T.lineEval(o1, o2, d1)
    z2 = T.lineEval(o2, d1, d2)
    if (z1+z2 < 0) { z1 = -z1; z2 = -z2 }
    v.s = T.merge_(z1, o2.s, z2, d1.s)
  } else {
    z1 = T.lineSign(o1, o2, d1)
    z2 = -T.lineSign(o1, d2, d1)
    if (z1+z2 < 0) { z1 = -z1; z2 = -z2 }
    v.s = T.merge_(z1, o2.s, z2, d2.s)
  }

  if (!T.Leq(o1, d1)) {
    swap = o1
    o1 = d1
    d1 = swap
  }
  if (!T.Leq(o2, d2)) {
    swap = o2
    o2 = d2
    d2 = swap
  }
  if (!T.Leq(o1, o2)) {
    swap = o1
    o1 = o2
    o2 = swap
    swap = d1
    d1 = d2
    d2 = swap
  }

  if (!T.Leq(o2, d1)) v.t = (o2.t + d1.t) / 2
  else if (T.Leq(d1, d2)) {
    z1 = T.Eval(o1, o2, d1)
    z2 = T.Eval(o2, d1, d2)
    if (z1+z2 < 0)  z1 = -z1, z2 = -z2
    v.t = T.merge_(z1, o2.t, z2, d1.t)
  } else {
    z1 = T.Sign(o1, o2, d1)
    z2 = -T.Sign(o1, d2, d1)
    if (z1+z2 < 0) { z1 = -z1; z2 = -z2 }
    v.t = T.merge_(z1, o2.t, z2, d2.t)
  }
}

T.projectShape = function(mala) {
  var computedPerp = false
    , norm = [0, 0, 0]
  norm[0] = mala.perp[0]
  norm[1] = mala.perp[1]
  norm[2] = mala.perp[2]
  if (norm[0] === 0 && norm[1] === 0 && norm[2] === 0) {
    T.computePerp_(mala, norm)
    computedPerp = true
  }

  var s = mala.s
  var t = mala.t
  var i = T.longAxis_(norm)

  if (T.TRUE_PROJECT) {
    T.perpize_(norm)

    s[i] = 0
    s[(i+1)%3] = T.S__X_
    s[(i+2)%3] = T.S__Y_

    var w = T.dot_(s, norm)
    s[0] -= w * norm[0]
    s[1] -= w * norm[1]
    s[2] -= w * norm[2]
    T.perpize_(s)

    t[0] = norm[1]*s[2] - norm[2]*s[1]
    t[1] = norm[2]*s[0] - norm[0]*s[2]
    t[2] = norm[0]*s[1] - norm[1]*s[0]
    T.perpize_(t)

  } else {
    s[i] = 0
    s[(i+1)%3] = T.S__X_
    s[(i+2)%3] = T.S__Y_

    t[i] = 0
    t[(i+1)%3] = (norm[i] > 0) ? -T.S__Y_ : T.S__Y_
    t[(i+2)%3] = (norm[i] > 0) ? T.S__X_ : -T.S__X_
  }

  var vStart = mala.surface.vStart
  for (var v = vStart.there; v !== vStart; v = v.there)
    v.s = T.dot_(v.xys, s), v.t = T.dot_(v.xys, t)

  if (computedPerp)
    T.fixOrientation_(mala)
}

T.dot_ = function(u, v) {
  return u[0]*v[0] + u[1]*v[1] + u[2]*v[2]
}

T.perpize_ = function(v) {
  var len = v[0]*v[0] + v[1]*v[1] + v[2]*v[2]
  debugT(len > 0) 
  len = Math.sqrt(len)
  v[0] /= len
  v[1] /= len
  v[2] /= len
}

T.longAxis_ = function(v) {
  var i = 0
  if (Math.abs(v[1]) > Math.abs(v[i])) i = 1
  if (Math.abs(v[2]) > Math.abs(v[i])) i = 2
  return i
}

T.computePerp_ = function(mala, norm) {
  var maxVal = [0, 0, 0]
  var minVal = [0, 0, 0]
  var d1 = [0, 0, 0]
  var d2 = [0, 0, 0]
  var tNorm = [0, 0, 0]

  maxVal[0] = maxVal[1] = maxVal[2] = -2 * T.MAX_XY
  minVal[0] = minVal[1] = minVal[2] = 2 * T.MAX_XY

  var maxPoint = new Array(3)
  var minPoint = new Array(3)

  var i
  var v
  var vStart = mala.surface.vStart
  for (v = vStart.there; v !== vStart; v = v.there) {
    for (i = 0; i < 3; ++i) {
      var c = v.xys[i]
      if (c < minVal[i]) { minVal[i] = c; minPoint[i] = v }
      if (c > maxVal[i]) { maxVal[i] = c; maxPoint[i] = v }
    }
  }

  i = 0

  if (maxVal[1] - minVal[1] > maxVal[0] - minVal[0]) i = 1
  if (maxVal[2] - minVal[2] > maxVal[i] - minVal[i]) i = 2
  if (minVal[i] >= maxVal[i]) return norm[0] = 0; norm[1] = 0; norm[2] = 1

  var maxLen2 = 0
  var v1 = minPoint[i]
  var v2 = maxPoint[i]
  d1[0] = v1.xys[0] - v2.xys[0]
  d1[1] = v1.xys[1] - v2.xys[1]
  d1[2] = v1.xys[2] - v2.xys[2]
  for (v = vStart.there; v !== vStart; v = v.there) {
    d2[0] = v.xys[0] - v2.xys[0]
    d2[1] = v.xys[1] - v2.xys[1]
    d2[2] = v.xys[2] - v2.xys[2]
    tNorm[0] = d1[1]*d2[2] - d1[2]*d2[1]
    tNorm[1] = d1[2]*d2[0] - d1[0]*d2[2]
    tNorm[2] = d1[0]*d2[1] - d1[1]*d2[0]
    var tLen2 = tNorm[0]*tNorm[0] + tNorm[1]*tNorm[1] + tNorm[2]*tNorm[2]
    if (tLen2 > maxLen2) {
      maxLen2 = tLen2
      norm[0] = tNorm[0]
      norm[1] = tNorm[1]
      norm[2] = tNorm[2]
    }
  }

  if (maxLen2 <= 0) {
    norm[0] = norm[1] = norm[2] = 0
    norm[T.longAxis_(d1)] = 1
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
