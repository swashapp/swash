contract SwashTwitter is Monoplasma {

    string public joinPartStream;

    constructor(address operator, string joinPartStreamId, address tokenAddress, uint blockFreezePeriodSeconds)
    Monoplasma(tokenAddress, blockFreezePeriodSeconds) public {
        setOperator(operator);
        joinPartStream = joinPartStreamId;
    }
}