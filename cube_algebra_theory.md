# The Algebra of 3-Tensors ("Cube Algebra")
### A complete theory, built the way matrix algebra is built — with an eye toward hardware

**Scope and provenance.** The load-bearing mathematics here is the *t-product* tensor algebra of Kilmer, Martin, Braman, Hao, Hoover, and the *M-product* generalization of Kernfeld–Kilmer–Aeron. None of the core theorems are invented here; what is assembled is a single, textbook-style development with the computational/hardware primitive made explicit at every step. Established results are stated as such; framing and the hardware thesis are flagged.

**The organizing analogy.** Matrix algebra is the algebra of *linear maps over a field* $\mathbb{F}$; its hardware primitive is the multiply–accumulate (MAC), arranged into a matrix–multiply array (a GPU tensor core). Cube algebra is the algebra of *linear maps over a ring* $R$ — the ring of "tubes." Its hardware primitive is a MAC whose scalar multiply is replaced by a **tube product** (a length-$p$ convolution). The single most important structural fact, proved in §4, is that this ring is a *product of fields*, so the entire algebra factors into $p$ independent copies of ordinary matrix algebra. That fact is simultaneously the reason every matrix theorem lifts, and the reason the natural hardware is "a transform plus a batch of ordinary matmuls."

---

## Part I — The scalars: the tube ring

In matrix algebra the scalars are a field $\mathbb{F}$. In cube algebra the scalars are *tubes*: the third-mode fibers of the cube.

### Definition 1.1 (tube)
A **tube** is a vector $a = (a_0,\dots,a_{p-1}) \in \mathbb{R}^p$. Tubes add componentwise.

### Definition 1.2 (tube product)
The **tube product** is circular convolution:
$$(a \circledast b)_k = \sum_{i=0}^{p-1} a_i\, b_{(k-i)\bmod p}, \qquad k = 0,\dots,p-1.$$

### Lemma 1.3 (the tube ring)
$(\mathbb{R}^p, +, \circledast)$ is a commutative ring with unity $e = (1,0,\dots,0)$. It is isomorphic to
$$R \;:=\; \mathbb{R}[x]/(x^p - 1),$$
the polynomial ring modulo $x^p-1$, and also to the ring of $p\times p$ **circulant matrices** under ordinary matrix multiplication.

*Proof.* Identify $a$ with the polynomial $\sum_i a_i x^i$. Convolution mod $p$ is exactly multiplication mod $x^p-1$, since $x^p \equiv 1$ enacts the cyclic wrap. The circulant correspondence sends $a$ to the matrix $\mathrm{circ}(a)$ whose first column is $a$; circulants multiply by convolving their generators. $\square$

### Theorem 1.4 (structure of the scalar ring — the master factorization)
Over $\mathbb{C}$, the discrete Fourier transform $F$ diagonalizes $R$:
$$\mathbb{C}[x]/(x^p-1)\;\cong\;\prod_{k=0}^{p-1}\mathbb{C},$$
with the isomorphism given by evaluating at the $p$-th roots of unity (the DFT). Consequently $R$ is **semisimple**: a finite product of fields, with **zero divisors** and nontrivial **idempotents**, but **no nilpotents**.

*Proof.* $x^p-1=\prod_{k}(x-\omega^k)$ has distinct roots $\omega^k=e^{2\pi i k/p}$. The Chinese Remainder Theorem gives $\mathbb{C}[x]/(x^p-1)\cong\prod_k \mathbb{C}[x]/(x-\omega^k)\cong\mathbb{C}^p$. Evaluation at $\omega^k$ is the $k$-th DFT coefficient. A product of fields is reduced (no nilpotents) and semisimple. $\square$

### Corollary 1.5 (units and the role of the DFT)
A tube $a$ is **invertible** in $R$ iff its DFT $\hat a$ has **no zero entry**; then $(a^{-1})\,\widehat{}\;=1/\hat a$ componentwise. The idempotents of $R$ are exactly the inverse-DFTs of $\{0,1\}$-vectors.

**Why this matters (and differs from a field).** The scalars of cube algebra are *not* a field: some nonzero tubes are non-invertible (they have a spectral zero). This is the one place the theory is genuinely richer — and occasionally trickier — than matrix algebra. It does **not** break the decomposition theory, precisely because $R$ is a *product of fields*: linear algebra works field-by-field, i.e. slice-by-slice in the Fourier domain.

> **Hardware note (the scalar ALU).** The fundamental scalar operation is no longer a multiply but a length-$p$ circular convolution. You have two physically distinct ways to build it: (a) a small time-domain convolution engine ($p$ MACs), or (b) "transform $\to$ pointwise complex multiply $\to$ inverse-transform." Theorem 1.4 says these are *the same operator*. Which one to etch in silicon is the central hardware fork; see Part XI.

---

## Part II — The vectors: free modules over $R$

Because $R$ is a ring, the right setting is **module theory over $R$**, the faithful analog of vector spaces over a field.

### Definition 2.1 (tube-vector / lateral slice)
A **tube-vector** of length $n$ is an element of the free module $R^n$ — equivalently an $n\times 1\times p$ tensor (a *lateral slice* of a cube). Scalars are tubes; linear combinations use $\circledast$.

### Lemma 2.2 (free modules behave like $p$ stacked vector spaces)
Under the DFT applied along the depth mode, $R^n \cong \prod_{k=0}^{p-1}\mathbb{C}^n$. An $R$-linear notion (independence, spanning, basis) holds for a family of tube-vectors iff the corresponding *complex-vector* notion holds in **each** of the $p$ Fourier slices.

*Proof.* Immediate from Theorem 1.4 applied coordinatewise; the DFT is an $R$-module isomorphism onto the product. $\square$

This lemma is the abstract engine of the whole theory: **every statement about cubes is $p$ simultaneous statements about complex matrices.**

---

## Part III — The operators: cubes as $R$-linear maps

### Definition 3.1 (cube)
A **cube** is a 3-tensor $\mathcal{A}\in\mathbb{R}^{m\times n\times p}$. Read it as an $m\times n$ matrix **over the ring $R$**: entry $(i,j)$ is the tube $\mathcal{A}_{ij:}$. Its **frontal slices** are $A^{(k)}=\mathcal{A}_{::k}\in\mathbb{R}^{m\times n}$.

### Definition 3.2 (t-product = composition of $R$-linear maps)
For $\mathcal{A}\in\mathbb{R}^{m\times n\times p}$, $\mathcal{B}\in\mathbb{R}^{n\times \ell\times p}$,
$$(\mathcal{A}*\mathcal{B})_{ij:}=\sum_{k=1}^{n}\mathcal{A}_{ik:}\circledast\mathcal{B}_{kj:}\;\in\;\mathbb{R}^{m\times\ell\times p}.$$
This is ordinary matrix multiplication with $R$ as the scalar ring: a cube *is* an $R$-linear map $R^n\to R^m$, and $*$ *is* composition.

### Definition 3.3 (block-circulant unfolding)
Let $\mathrm{unfold}(\mathcal{B})$ stack $\mathcal{B}$'s frontal slices into a $np\times\ell$ matrix, and $\mathrm{bcirc}(\mathcal{A})$ be the $mp\times np$ block-circulant matrix of $\mathcal{A}$'s frontal slices. Then
$$\mathcal{A}*\mathcal{B}=\mathrm{fold}\big(\mathrm{bcirc}(\mathcal{A})\cdot\mathrm{unfold}(\mathcal{B})\big).$$
This makes $*$ a *bona fide matrix product*, hence inherits associativity for free.

---

## Part IV — The master theorem: the Fourier (or $M$-) isomorphism

This is the cube-algebra analog of "every matrix diagonalizes over $\overline{\mathbb F}$," but it is *exact, structural, and global* — it diagonalizes the whole **algebra**, not a single operator.

### Theorem 4.1 (block diagonalization)
Let $F$ be the $p$-point DFT and $\hat{\mathcal{A}}=\mathrm{FFT}(\mathcal{A})$ along the depth mode, with frontal slices $\hat A^{(1)},\dots,\hat A^{(p)}$. Then
$$(F\otimes I_m)\,\mathrm{bcirc}(\mathcal{A})\,(F^{-1}\otimes I_n)=\mathrm{blockdiag}\big(\hat A^{(1)},\dots,\hat A^{(p)}\big),$$
and therefore
$$\widehat{(\mathcal{A}*\mathcal{B})}^{(k)}=\hat A^{(k)}\,\hat B^{(k)},\qquad k=1,\dots,p.$$

*Proof.* The DFT diagonalizes circulants (Lemma 1.3, Theorem 1.4). $\mathrm{bcirc}$ is block-circulant, so the block-DFT $F\otimes I$ block-diagonalizes it; the diagonal blocks are the depthwise-DFT slices. Multiplying block-diagonal matrices multiplies blocks. $\square$

### Corollary 4.2 (algebra isomorphism)
The algebra $(\mathbb{R}^{n\times n\times p},+,*)$ is isomorphic, via the depthwise DFT, to the product algebra $\prod_{k=1}^{p}\mathbb{C}^{n\times n}$ (with a conjugate-symmetry constraint encoding reality: $\hat A^{(k)}=\overline{\hat A^{(p-k+2)}}$). **Cube algebra is $p$ independent copies of complex matrix algebra, glued by an FFT.**

This single corollary is the reason every theorem below is provable by one move: *transform along depth, do the matrix theorem in each slice, transform back.* I will call this **"the slicewise argument."**

> **Hardware note (the canonical kernel).** Theorem 4.1 *is* the reference implementation:
> 1. FFT along depth ($O(mn\,p\log p)$),
> 2. $p$ independent GEMMs $\hat A^{(k)}\hat B^{(k)}$ — embarrassingly parallel, maps directly onto existing tensor cores,
> 3. inverse FFT along depth.
> The arithmetic intensity of step 2 dominates for large $m,n,\ell$, so a cube accelerator is, to first order, **a depth-transform front end feeding a batched-GEMM array.** Hold this thought; Part XI argues it is also the *right* design.

---

## Part V — The square algebra: identity, inverse, transpose

### Definition 5.1 (identity)
$\mathcal{I}\in\mathbb{R}^{n\times n\times p}$ has first frontal slice $I_n$ and all others zero. In the Fourier domain every slice is $I_n$. Then $\mathcal{A}*\mathcal{I}=\mathcal{I}*\mathcal{A}=\mathcal{A}$.

### Lemma 5.2 (associative unital algebra)
$(\mathbb{R}^{n\times n\times p},+,*)$ is an associative algebra with unit $\mathcal{I}$. *Proof:* slicewise it is $\prod_k\mathbb{C}^{n\times n}$, each associative and unital. $\square$

### Definition 5.3 (transpose and conjugate transpose)
$\mathcal{A}^{\mathsf T}\in\mathbb{R}^{n\times m\times p}$ transposes each frontal slice **and** reverses the depth order of slices $2,\dots,p$. In the Fourier domain this is the conjugate transpose of each $\hat A^{(k)}$. Then $(\mathcal{A}*\mathcal{B})^{\mathsf T}=\mathcal{B}^{\mathsf T}*\mathcal{A}^{\mathsf T}$.

### Definition 5.4 (invertibility)
$\mathcal{A}\in\mathbb{R}^{n\times n\times p}$ is **t-invertible** if there is $\mathcal{A}^{-1}$ with $\mathcal{A}*\mathcal{A}^{-1}=\mathcal{I}$.

### Theorem 5.5 (inverse criterion)
$\mathcal{A}$ is t-invertible **iff every Fourier slice $\hat A^{(k)}$ is invertible**, and then $\widehat{(\mathcal{A}^{-1})}^{(k)}=(\hat A^{(k)})^{-1}$.

*Proof.* The slicewise argument; invertibility in $\prod_k\mathbb{C}^{n\times n}$ is slicewise invertibility. $\square$

### Definition 5.6 (tubal determinant)
Define $\mathrm{tdet}(\mathcal{A})$ to be the **tube** whose $k$-th Fourier coefficient is $\det \hat A^{(k)}$.

### Theorem 5.7 (multiplicative determinant)
$\mathrm{tdet}(\mathcal{A}*\mathcal{B})=\mathrm{tdet}(\mathcal{A})\circledast\mathrm{tdet}(\mathcal{B})$, and $\mathcal{A}$ is t-invertible iff $\mathrm{tdet}(\mathcal{A})$ is a **unit** of $R$ (Corollary 1.5: no spectral zero).

*Proof.* $\det$ is multiplicative slicewise; products of slices map to $\circledast$ of tubes under inverse DFT. $\square$

Note the elegant upgrade: in matrix algebra the determinant is a *scalar*; here it is a *tube*, and "nonzero determinant" becomes "the determinant tube is spectrally nowhere zero."

---

## Part VI — Orthogonality, norms, geometry

There are **two** inner products, and keeping them distinct prevents most confusion.

### Definition 6.1 (R-valued inner product)
For tube-vectors $x,y\in R^n$, $\langle x,y\rangle_R:=\sum_i \bar x_i\circledast y_i\in R$ — a **tube**, the honest module inner product.

### Definition 6.2 (scalar Frobenius inner product)
$\langle\mathcal{A},\mathcal{B}\rangle_F:=\sum_{ijk}\mathcal{A}_{ijk}\mathcal{B}_{ijk}\in\mathbb{R}$, with norm $\|\mathcal{A}\|_F=\langle\mathcal{A},\mathcal{A}\rangle_F^{1/2}$.

### Lemma 6.3 (Parseval)
$\|\mathcal{A}\|_F^2=\tfrac1p\sum_{k}\|\hat A^{(k)}\|_F^2$. *Proof:* unitarity of the (normalized) DFT. $\square$

### Definition 6.4 (orthogonal cube)
$\mathcal{Q}\in\mathbb{R}^{n\times n\times p}$ is **t-orthogonal** if $\mathcal{Q}^{\mathsf T}*\mathcal{Q}=\mathcal{Q}*\mathcal{Q}^{\mathsf T}=\mathcal{I}$, equivalently every $\hat Q^{(k)}$ is unitary.

### Lemma 6.5 (isometry)
t-orthogonal cubes preserve $\|\cdot\|_F$. *Proof:* slicewise unitary invariance + Parseval. $\square$

---

## Part VII — The decompositions (the crown jewels)

All proofs are the slicewise argument: perform the matrix factorization in each $\hat A^{(k)}$, then inverse-transform. I state them as a matrix text would.

### Definition 7.1 (f-diagonal)
$\mathcal{S}$ is **f-diagonal** if each frontal slice is diagonal.

### Theorem 7.2 (t-SVD)
Every $\mathcal{A}\in\mathbb{R}^{m\times n\times p}$ admits
$$\mathcal{A}=\mathcal{U}*\mathcal{S}*\mathcal{V}^{\mathsf T},$$
with $\mathcal{U}\in\mathbb{R}^{m\times m\times p}$, $\mathcal{V}\in\mathbb{R}^{n\times n\times p}$ t-orthogonal and $\mathcal{S}$ f-diagonal with nonnegative-real singular tubes ordered by $\|\cdot\|$. *(Kilmer–Martin.)*

### Definition 7.3 (tubal rank and multirank)
The **tubal rank** is the number of nonzero singular tubes of $\mathcal{S}$. The **multirank** is the tuple $(\operatorname{rank}\hat A^{(k)})_{k=1}^p$.

### Theorem 7.4 (Eckart–Young, restored)
Let $\mathcal{A}_r=\sum_{i=1}^{r}\mathcal{U}(:,i,:)*\mathcal{S}(i,i,:)*\mathcal{V}(:,i,:)^{\mathsf T}$ be the truncated t-SVD. Then
$$\mathcal{A}_r=\arg\min_{\operatorname{tubal\,rank}(\mathcal{X})\le r}\|\mathcal{A}-\mathcal{X}\|_F.$$
*(Kilmer–Braman–Hao–Hoover.)* This is exactly the property that **fails** for ordinary CP/tensor rank — recovered here because the algebra is a product of fields (Cor. 4.2).

### Theorem 7.5 (t-QR)
$\mathcal{A}=\mathcal{Q}*\mathcal{R}$ with $\mathcal{Q}$ t-orthogonal and $\mathcal{R}$ f-upper-triangular.

### Theorem 7.6 (t-spectral theorem)
If $\mathcal{A}$ is **t-symmetric** ($\mathcal{A}^{\mathsf T}=\mathcal{A}$, i.e. each $\hat A^{(k)}$ Hermitian), then
$$\mathcal{A}=\mathcal{Q}*\mathcal{D}*\mathcal{Q}^{\mathsf T},$$
$\mathcal{Q}$ t-orthogonal, $\mathcal{D}$ f-diagonal with real **eigentubes** on the diagonal.

### Definition 7.7 (t-positive-definiteness)
$\mathcal{A}$ is **t-SPD** if every $\hat A^{(k)}$ is Hermitian positive definite.

### Theorem 7.8 (t-Cholesky and t-polar)
A t-SPD cube factors as $\mathcal{A}=\mathcal{L}*\mathcal{L}^{\mathsf T}$ (f-lower-triangular $\mathcal{L}$). Every $\mathcal{A}$ has a polar form $\mathcal{A}=\mathcal{Q}*\mathcal{P}$ with $\mathcal{Q}$ t-orthogonal and $\mathcal{P}$ t-SPD.

> **Hardware note (decomposition engines).** Each decomposition is "$p$ batched matrix decompositions in the transform domain." A cube SVD/eig/Cholesky unit is therefore a **batched** matrix-factorization unit bracketed by FFTs — again reusing existing dense-linear-algebra silicon. No factorization needs a fundamentally new datapath; it needs batching and a transform stage.

---

## Part VIII — Spectral theory and functional calculus

### Definition 8.1 (cube function)
For $f:\mathbb{C}\to\mathbb{C}$ (analytic, or defined on the spectra), define $f(\mathcal{A})$ by applying the **matrix function** $f$ to each Fourier slice $\hat A^{(k)}$ and inverse-transforming.

### Theorem 8.2 (functional calculus)
$f(\mathcal{A})$ is well-defined; it commutes with $*$-polynomials in $\mathcal{A}$, and specializes to: $\mathcal{A}^{-1}$ (when t-invertible), $\exp(\mathcal{A})$, $\log$, and $\mathcal{A}^{1/2}$ (when t-SPD). *Proof:* matrix functional calculus, slicewise; consistency across slices holds because the DFT is an algebra isomorphism. $\square$

This gives, for free, cube analogs of the matrix exponential (dynamical systems), the matrix square root (whitening), and spectral filtering — each is "filter the slices."

---

## Part IX — Solving systems (the computational core)

### Theorem 9.1 (t-linear systems)
$\mathcal{A}*\mathcal{X}=\mathcal{B}$ has a unique solution iff $\mathcal{A}$ is t-invertible; compute it by solving the $p$ decoupled systems $\hat A^{(k)}\hat X^{(k)}=\hat B^{(k)}$ and inverse-transforming.

### Definition 9.2 (t-pseudoinverse)
$\mathcal{A}^{\dagger}$ is defined slicewise by the Moore–Penrose pseudoinverse of each $\hat A^{(k)}$; equivalently $\mathcal{A}^{\dagger}=\mathcal{V}*\mathcal{S}^{\dagger}*\mathcal{U}^{\mathsf T}$ from the t-SVD.

### Theorem 9.3 (t-least squares)
$\min_{\mathcal{X}}\|\mathcal{A}*\mathcal{X}-\mathcal{B}\|_F$ is attained at $\mathcal{X}=\mathcal{A}^{\dagger}*\mathcal{B}$. *Proof:* slicewise least squares + Parseval. $\square$

### Definition 9.4 (condition number)
$\kappa(\mathcal{A})=\max_k \kappa_2(\hat A^{(k)})$. Numerical stability of cube solves is governed by the worst slice.

---

## Part X — Rank theory and the honest limitations

### Proposition 10.1 (what cube algebra fixes)
Within this algebra, rank (tubal/multirank), best low-rank approximation (Thm 7.4), and a clean spectral theory (Thm 7.6) all exist and are polynomial-time computable — precisely the structure that is NP-hard or ill-posed for generic 3-tensors (CP rank is NP-hard; best CP rank-$r$ approximation may fail to exist).

### Proposition 10.2 (the price)
Cube algebra is **not** a universal theory of 3-tensors. It privileges one mode (the depth) and equips it with a *fixed cyclic/convolutional* structure (the group $\mathbb{Z}/p\mathbb{Z}$). Equivalently, it is exactly the class of operations that are **shift-invariant along depth**. Phenomena that are genuinely *trilinear and symmetric in all three modes* (e.g. a symmetric moment tensor) are not its natural objects. The tractability is bought by this asymmetry; that is the whole trade.

---

## Part XI — Generalizations = the hardware design space

The cyclic group and the DFT are **choices**, not necessities. Loosening them is simultaneously a mathematical generalization and an enumeration of buildable hardware.

### Theorem 11.1 (the $M$-product — Kernfeld–Kilmer–Aeron)
Let $M\in\mathbb{C}^{p\times p}$ (or $\mathbb{R}^{p\times p}$) be **any invertible** matrix acting along depth. Define
$$\mathcal{A}*_M\mathcal{B}\;:=\;M^{-1}\!\big[(M\mathcal{A})\;\boxtimes\;(M\mathcal{B})\big],$$
where $M\mathcal{A}$ transforms each tube and $\boxtimes$ is frontal-slicewise matmul. Then **every theorem in Parts IV–IX holds verbatim**, with "DFT slice" replaced by "$M$-slice." The t-product is the case $M=F$ (whose implicit tube product is circular convolution).

This is the pivotal result for hardware: **the depth-mixing transform $M$ is a free parameter.** Implications:

1. **Cheap fixed transforms.** $M=$ Hadamard (a Walsh–Hadamard transform) costs only additions/subtractions — no multipliers, $O(p\log p)$ with a trivial datapath. A Hadamard-product cube unit is dramatically cheaper to build than an FFT-based one and supports the full decomposition theory.
2. **Learned transforms.** $M$ may be *learned* and folded into adjacent weight tensors. Then the "transform" disappears into a GEMM, and the entire cube product becomes **reshape + batched matmul** on standard tensor hardware.
3. **Multidimensional / nonabelian generalizations.** Replacing $\mathbb{Z}/p\mathbb{Z}$ by a product group $\mathbb{Z}/p\times\mathbb{Z}/q$ gives the **order-4 (4-D) product** (a 2-D FFT, $pq$ batched GEMMs). Replacing it by a *nonabelian* group makes the tube ring non-commutative (block-diagonal with blocks of size $>1$ from the group's irreducible representations) — a strictly richer "scalar" with no matrix-algebra analog.

### The silicon thesis (framing, stated plainly)

The matrix-on-GPU situation: the primitive is the FMA, the architecture is a systolic/tensor-core array, and the ecosystem (BLAS, the memory hierarchy, the compilers) is built around dense GEMM. The honest reading of Parts IV and XI is that there are **three** ways to accelerate cube algebra, in increasing order of novelty and risk:

- **(A) Transform-front-end + existing tensor cores.** Add an FFT/Hadamard unit and a depth-contiguous memory layout; batch $p$ GEMMs through the existing array. *Lowest risk; reuses the entire GEMM ecosystem.* By Corollary 4.2 this loses nothing algebraically. The real engineering work is **dataflow and memory** — keeping tubes contiguous and streaming $p$ slices without thrashing — not a new ALU.
- **(B) Native convolutional-MAC systolic array.** Each processing element performs a length-$p$ circular convolution-accumulate instead of a scalar MAC. By Theorem 4.1 this computes the *same* function as (A). It wins only in specific regimes: small/fixed $p$, latency-critical paths where you cannot afford transform round-trips, or process nodes where short convolutions are cheaper than a transform stage.
- **(C) Fixed-transform datapath (the sweet spot).** Bake a cheap, fixed $M$ (Hadamard) into the datapath (Theorem 11.1.1): adders for the transform, the existing array for the batched matmul. You get the full decomposition theory with near-zero transform cost and a clean dataflow.

The sharpest, most fundable version of the bet is therefore *not* "invent a new multiplier." It is: **make tube-contiguous, transform-bracketed batched GEMM a first-class hardware citizen** — a memory hierarchy, dataflow, and instruction set designed so that the depth axis is the innermost, cheapest axis to mix and the slice axis is the batch dimension. That is a genuine architectural contribution, and it is exactly what the algebra above says the primitive is. The case for fully native convolutional silicon (B) should be made only after measuring the regimes where the transform round-trip actually dominates.

---

## Appendix — The matrix ↔ cube dictionary

| Matrix algebra (over field $\mathbb F$) | Cube algebra (over tube ring $R$) |
|---|---|
| scalar $\in\mathbb F$ | tube $\in R=\mathbb R[x]/(x^p-1)$ |
| scalar multiply | circular convolution $\circledast$ |
| nonzero scalar is invertible | tube invertible iff spectrally nowhere zero |
| vector $\in\mathbb F^n$ | tube-vector $\in R^n$ (lateral slice) |
| matrix = linear map | cube = $R$-linear map (matrix over $R$) |
| matrix product | t-product $*$ |
| diagonalize one operator over $\overline{\mathbb F}$ | block-diagonalize the **algebra** via DFT (Thm 4.1) |
| identity $I$ | identity cube $\mathcal I$ |
| transpose / adjoint | t-transpose $\mathcal A^{\mathsf T}$ |
| determinant (scalar) | tubal determinant (tube), Thm 5.7 |
| SVD | t-SVD (Thm 7.2) |
| Eckart–Young | t-Eckart–Young (Thm 7.4) — **recovered** |
| symmetric eigendecomposition | t-spectral theorem (Thm 7.6) |
| SPD / Cholesky | t-SPD / t-Cholesky (Thm 7.8) |
| matrix function $f(A)$ | cube function (Thm 8.2) |
| $Ax=b$, least squares, $A^\dagger$ | t-solve, t-least-squares, $\mathcal A^\dagger$ (Part IX) |
| condition number | $\kappa=\max_k\kappa(\hat A^{(k)})$ |
| **hardware primitive: FMA / GEMM array** | **primitive: transform + batched GEMM (Parts IV, XI)** |

---

### One-paragraph summary
Cube algebra is linear algebra over the tube ring $R=\mathbb R[x]/(x^p-1)$. Because $R$ is a product of fields (Theorem 4.1), the entire theory — products, inverses, SVD, Eckart–Young, spectral theorem, Cholesky, functional calculus, least squares — is $p$ copies of complex matrix algebra stitched by an invertible depth transform. That same fact dictates the hardware: the fundamental operation is a depth-mixing transform feeding a batch of ordinary matrix multiplies, so the most promising accelerator is one whose memory and dataflow make tube-contiguous, transform-bracketed batched GEMM the primitive — with a cheap fixed transform (Hadamard) as the pragmatic datapath, and fully native convolutional MACs reserved for the regimes where measurement shows the transform round-trip dominates.
