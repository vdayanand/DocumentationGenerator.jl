var documenterSearchIndex = {"docs": [

{
    "location": "#",
    "page": "Readme",
    "title": "Readme",
    "category": "page",
    "text": ""
},

{
    "location": "#ConjugatePriors.jl-1",
    "page": "Readme",
    "title": "ConjugatePriors.jl",
    "category": "section",
    "text": "(Image: Build Status) (Image: Coverage Status) (Image: ConjugatePriors)A Julia package to support conjugate prior distributions."
},

{
    "location": "autodocs/#ConjugatePriors.NormalInverseChisq",
    "page": "Docstrings",
    "title": "ConjugatePriors.NormalInverseChisq",
    "category": "type",
    "text": "NormalInverseChisq(μ, σ2, κ, ν)\n\nA Normal-χ^-2 distribution is a conjugate prior for a Normal distribution with unknown mean and variance.  It has parameters:\n\nμ: expected mean\nσ2 > 0: expected variance\nκ ≥ 0: mean confidence\nν ≥ 0: variance confidence\n\nThe parameters have a natural interpretation when used as a prior for a Normal distribution with unknown mean and variance: μ and σ2 are the expected mean and variance, while κ and ν are the respective degrees of confidence (expressed in \"pseudocounts\").  When interpretable parameters are important, this makes it a slightly more convenient parametrization of the conjugate prior.\n\nEquivalent to a NormalInverseGamma distribution with parameters:\n\nm0 = μ\nv0 = 1/κ\nshape = ν/2\nscale = νσ2/2\n\nBased on Murphy \"Conjugate Bayesian analysis of the Gaussian distribution\".\n\n\n\n\n\n"
},

{
    "location": "autodocs/#StatsBase.params-Tuple{NormalInverseWishart}",
    "page": "Docstrings",
    "title": "StatsBase.params",
    "category": "method",
    "text": "params(niw::NormalInverseWishart)\n\nThe parameters are\n\nμ::Vector{T<:Real} the expected mean vector\nΛchol::Cholesky{T<:Real} the Cholesky decomposition of the scale matrix\nκ::T<:Real prior pseudocount for the mean\nν::T<:Real prior pseudocount for the covariance\n\n\n\n\n\n"
},

{
    "location": "autodocs/#",
    "page": "Docstrings",
    "title": "Docstrings",
    "category": "page",
    "text": "Package doesn\'t contain Documenter docs.Docs automatically generated by juliadocs.orgModules = [ConjugatePriors]\nOrder = [:type, :function]"
},

]}
