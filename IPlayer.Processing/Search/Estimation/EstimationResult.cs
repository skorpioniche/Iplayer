﻿using System.Collections.Generic;
using IntellectualPlayer.Core;

namespace IntellectualPlayer.Processing.Search
{
    /// <summary>
    /// Represents an algorithm estimation process result.
    /// </summary>
    public class EstimationResult
    {
        public string AlgorithmName
        {
            get;
            set;
        }

        public string Parameters
        {
            get;
            set;
        }

        public double PearsonCoeff
        {
            get;
            set;
        }

        public double Mean
        {
            get;
            set;
        }

        public double StandardDeviation
        {
            get;
            set;
        }

        public double Covariance
        {
            get;
            set;
        }

        public Dictionary<SHA1Hash, Dictionary<SHA1Hash, int>> Scores
        {
            get;
            set;
        }
    }
}
